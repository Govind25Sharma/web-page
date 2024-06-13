from flask import Flask, request, jsonify, send_from_directory
import sqlite3

app = Flask(__name__)

DATABASE = 'items.db'

def init_db():
    with sqlite3.connect(DATABASE) as conn:
        conn.execute('''CREATE TABLE IF NOT EXISTS items
                        (id INTEGER PRIMARY KEY AUTOINCREMENT,
                         item TEXT UNIQUE)''')

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/styles.css')
def styles():
    return send_from_directory('.', 'styles.css')

@app.route('/script.js')
def script():
    return send_from_directory('.', 'script.js')

@app.route('/add', methods=['POST'])
def add_item():
    data = request.json
    item = data.get('item')
    try:
        with sqlite3.connect(DATABASE) as conn:
            conn.execute('INSERT INTO items (item) VALUES (?)', (item,))
        return jsonify({'success': True})
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'error': 'Item already exists.'})

@app.route('/delete', methods=['POST'])
def delete_item():
    data = request.json
    item = data.get('item')
    with sqlite3.connect(DATABASE) as conn:
        conn.execute('DELETE FROM items WHERE item = ?', (item,))
    return jsonify({'success': True})

@app.route('/items', methods=['GET'])
def get_items():
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.execute('SELECT item FROM items')
        items = [row[0] for row in cursor.fetchall()]
    return jsonify({'success': True, 'items': items})

if __name__ == '__main__':
    init_db()
    app.run(debug=True)