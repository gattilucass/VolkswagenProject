#!/usr/bin/env python3
"""
VW ID.4 Campaign Website Backend
Flask application with PostgreSQL database integration
"""

import os
import json
from datetime import datetime
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor

app = Flask(__name__)
CORS(app)

# Database connection
def get_db_connection():
    try:
        conn = psycopg2.connect(
            host=os.getenv('PGHOST'),
            database=os.getenv('PGDATABASE'),
            user=os.getenv('PGUSER'),
            password=os.getenv('PGPASSWORD'),
            port=os.getenv('PGPORT')
        )
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

# Initialize database tables
def init_db():
    conn = get_db_connection()
    if not conn:
        return False
    
    try:
        cur = conn.cursor()
        
        # Campaign interactions table
        cur.execute('''
            CREATE TABLE IF NOT EXISTS campaign_interactions (
                id SERIAL PRIMARY KEY,
                session_id VARCHAR(255),
                interaction_type VARCHAR(100),
                section VARCHAR(100),
                data JSONB,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                ip_address VARCHAR(45),
                user_agent TEXT
            )
        ''')
        
        # Visual views table
        cur.execute('''
            CREATE TABLE IF NOT EXISTS visual_views (
                id SERIAL PRIMARY KEY,
                visual_id INTEGER,
                visual_name VARCHAR(255),
                view_count INTEGER DEFAULT 1,
                session_id VARCHAR(255),
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Contact form submissions
        cur.execute('''
            CREATE TABLE IF NOT EXISTS contact_submissions (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255),
                company VARCHAR(255),
                message TEXT,
                interest_level VARCHAR(50),
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Campaign analytics
        cur.execute('''
            CREATE TABLE IF NOT EXISTS campaign_analytics (
                id SERIAL PRIMARY KEY,
                metric_name VARCHAR(100),
                metric_value NUMERIC,
                metric_data JSONB,
                date_recorded DATE DEFAULT CURRENT_DATE,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        cur.close()
        conn.close()
        print("Database tables initialized successfully")
        return True
        
    except Exception as e:
        print(f"Database initialization error: {e}")
        conn.rollback()
        conn.close()
        return False

# API Routes

@app.route('/')
def serve_website():
    """Serve the main website"""
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return "Website not found", 404

@app.route('/styles.css')
def serve_styles():
    """Serve the CSS file"""
    try:
        with open('styles.css', 'r', encoding='utf-8') as f:
            response = app.response_class(
                f.read(),
                mimetype='text/css'
            )
            return response
    except FileNotFoundError:
        return "CSS not found", 404

@app.route('/script.js')
def serve_script():
    """Serve the JavaScript file"""
    try:
        with open('script.js', 'r', encoding='utf-8') as f:
            response = app.response_class(
                f.read(),
                mimetype='application/javascript'
            )
            return response
    except FileNotFoundError:
        return "Script not found", 404

@app.route('/api/track-interaction', methods=['POST'])
def track_interaction():
    """Track user interactions with the campaign"""
    data = request.get_json()
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cur = conn.cursor()
        cur.execute('''
            INSERT INTO campaign_interactions 
            (session_id, interaction_type, section, data, ip_address, user_agent)
            VALUES (%s, %s, %s, %s, %s, %s)
        ''', (
            data.get('session_id'),
            data.get('type'),
            data.get('section'),
            json.dumps(data.get('data', {})),
            request.remote_addr,
            request.headers.get('User-Agent')
        ))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({"status": "success"}), 200
        
    except Exception as e:
        print(f"Error tracking interaction: {e}")
        conn.rollback()
        conn.close()
        return jsonify({"error": "Failed to track interaction"}), 500

@app.route('/api/track-visual-view', methods=['POST'])
def track_visual_view():
    """Track visual/lightbox views"""
    data = request.get_json()
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cur = conn.cursor()
        
        # Check if this visual was already viewed in this session
        cur.execute('''
            SELECT id FROM visual_views 
            WHERE visual_id = %s AND session_id = %s
        ''', (data.get('visual_id'), data.get('session_id')))
        
        existing = cur.fetchone()
        
        if not existing:
            cur.execute('''
                INSERT INTO visual_views 
                (visual_id, visual_name, session_id)
                VALUES (%s, %s, %s)
            ''', (
                data.get('visual_id'),
                data.get('visual_name'),
                data.get('session_id')
            ))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({"status": "success"}), 200
        
    except Exception as e:
        print(f"Error tracking visual view: {e}")
        conn.rollback()
        conn.close()
        return jsonify({"error": "Failed to track visual view"}), 500

@app.route('/api/submit-contact', methods=['POST'])
def submit_contact():
    """Handle contact form submissions"""
    data = request.get_json()
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cur = conn.cursor()
        cur.execute('''
            INSERT INTO contact_submissions 
            (name, email, company, message, interest_level)
            VALUES (%s, %s, %s, %s, %s)
        ''', (
            data.get('name'),
            data.get('email'),
            data.get('company'),
            data.get('message'),
            data.get('interest_level')
        ))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({"status": "success", "message": "Contact form submitted successfully"}), 200
        
    except Exception as e:
        print(f"Error submitting contact form: {e}")
        conn.rollback()
        conn.close()
        return jsonify({"error": "Failed to submit contact form"}), 500

@app.route('/api/analytics/dashboard', methods=['GET'])
def get_analytics_dashboard():
    """Get analytics dashboard data"""
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get interaction stats
        cur.execute('''
            SELECT 
                interaction_type,
                COUNT(*) as count,
                COUNT(DISTINCT session_id) as unique_sessions
            FROM campaign_interactions 
            GROUP BY interaction_type
            ORDER BY count DESC
        ''')
        interactions = cur.fetchall()
        
        # Get most viewed visuals
        cur.execute('''
            SELECT 
                visual_name,
                COUNT(*) as views
            FROM visual_views 
            GROUP BY visual_name
            ORDER BY views DESC
            LIMIT 5
        ''')
        top_visuals = cur.fetchall()
        
        # Get daily activity
        cur.execute('''
            SELECT 
                DATE(timestamp) as date,
                COUNT(*) as interactions,
                COUNT(DISTINCT session_id) as unique_visitors
            FROM campaign_interactions 
            WHERE timestamp >= CURRENT_DATE - INTERVAL '7 days'
            GROUP BY DATE(timestamp)
            ORDER BY date DESC
        ''')
        daily_activity = cur.fetchall()
        
        # Get total stats
        cur.execute('''
            SELECT 
                COUNT(DISTINCT session_id) as total_visitors,
                COUNT(*) as total_interactions
            FROM campaign_interactions
        ''')
        totals = cur.fetchone()
        
        cur.close()
        conn.close()
        
        return jsonify({
            "interactions": [dict(row) for row in interactions],
            "top_visuals": [dict(row) for row in top_visuals],
            "daily_activity": [dict(row) for row in daily_activity],
            "totals": dict(totals) if totals else {}
        }), 200
        
    except Exception as e:
        print(f"Error getting analytics: {e}")
        conn.close()
        return jsonify({"error": "Failed to get analytics"}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    conn = get_db_connection()
    if conn:
        conn.close()
        return jsonify({"status": "healthy", "database": "connected"}), 200
    else:
        return jsonify({"status": "unhealthy", "database": "disconnected"}), 500

# Admin dashboard route
@app.route('/admin/dashboard')
def admin_dashboard():
    """Simple admin dashboard"""
    dashboard_html = '''
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>VW ID.4 Campaign - Admin Dashboard</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
            body { font-family: 'Montserrat', sans-serif; background-color: #111827; color: #F9FAFB; }
        </style>
    </head>
    <body class="bg-gray-900 text-white">
        <div class="container mx-auto px-6 py-8">
            <h1 class="text-4xl font-bold mb-8 text-center text-indigo-400">VW ID.4 Campaign Analytics</h1>
            
            <div class="grid md:grid-cols-4 gap-6 mb-8">
                <div class="bg-gray-800 p-6 rounded-lg">
                    <h3 class="text-lg font-semibold mb-2">Total Visitors</h3>
                    <p class="text-3xl font-bold text-indigo-400" id="total-visitors">-</p>
                </div>
                <div class="bg-gray-800 p-6 rounded-lg">
                    <h3 class="text-lg font-semibold mb-2">Total Interactions</h3>
                    <p class="text-3xl font-bold text-green-400" id="total-interactions">-</p>
                </div>
                <div class="bg-gray-800 p-6 rounded-lg">
                    <h3 class="text-lg font-semibold mb-2">Visual Views</h3>
                    <p class="text-3xl font-bold text-yellow-400" id="visual-views">-</p>
                </div>
                <div class="bg-gray-800 p-6 rounded-lg">
                    <h3 class="text-lg font-semibold mb-2">Contact Forms</h3>
                    <p class="text-3xl font-bold text-purple-400" id="contact-forms">-</p>
                </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-8">
                <div class="bg-gray-800 p-6 rounded-lg">
                    <h3 class="text-xl font-semibold mb-4">Top Visual Views</h3>
                    <div id="top-visuals" class="space-y-2"></div>
                </div>
                
                <div class="bg-gray-800 p-6 rounded-lg">
                    <h3 class="text-xl font-semibold mb-4">Interaction Types</h3>
                    <div id="interactions" class="space-y-2"></div>
                </div>
            </div>
            
            <div class="mt-8 bg-gray-800 p-6 rounded-lg">
                <h3 class="text-xl font-semibold mb-4">Daily Activity (Last 7 Days)</h3>
                <canvas id="dailyChart" width="400" height="200"></canvas>
            </div>
        </div>
        
        <script>
            async function loadDashboard() {
                try {
                    const response = await fetch('/api/analytics/dashboard');
                    const data = await response.json();
                    
                    // Update totals
                    document.getElementById('total-visitors').textContent = data.totals.total_visitors || 0;
                    document.getElementById('total-interactions').textContent = data.totals.total_interactions || 0;
                    
                    // Calculate visual views
                    const totalVisualViews = data.top_visuals.reduce((sum, item) => sum + item.views, 0);
                    document.getElementById('visual-views').textContent = totalVisualViews;
                    
                    // Contact forms (from interactions)
                    const contactForms = data.interactions.find(i => i.interaction_type === 'contact_form');
                    document.getElementById('contact-forms').textContent = contactForms ? contactForms.count : 0;
                    
                    // Top visuals
                    const topVisualsHtml = data.top_visuals.map(visual => 
                        `<div class="flex justify-between"><span>${visual.visual_name}</span><span class="text-indigo-400">${visual.views}</span></div>`
                    ).join('');
                    document.getElementById('top-visuals').innerHTML = topVisualsHtml;
                    
                    // Interactions
                    const interactionsHtml = data.interactions.map(interaction => 
                        `<div class="flex justify-between"><span>${interaction.interaction_type}</span><span class="text-green-400">${interaction.count}</span></div>`
                    ).join('');
                    document.getElementById('interactions').innerHTML = interactionsHtml;
                    
                    // Daily chart
                    const ctx = document.getElementById('dailyChart').getContext('2d');
                    new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: data.daily_activity.map(d => d.date),
                            datasets: [{
                                label: 'Daily Interactions',
                                data: data.daily_activity.map(d => d.interactions),
                                borderColor: '#6366F1',
                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                tension: 0.4
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: { labels: { color: '#F9FAFB' } }
                            },
                            scales: {
                                x: { ticks: { color: '#D1D5DB' } },
                                y: { ticks: { color: '#D1D5DB' } }
                            }
                        }
                    });
                    
                } catch (error) {
                    console.error('Error loading dashboard:', error);
                }
            }
            
            loadDashboard();
            setInterval(loadDashboard, 30000); // Refresh every 30 seconds
        </script>
    </body>
    </html>
    '''
    return render_template_string(dashboard_html)

if __name__ == '__main__':
    # Initialize database on startup
    init_db()
    
    # Run the Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)