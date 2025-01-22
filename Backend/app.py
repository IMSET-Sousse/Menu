from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from datetime import datetime

app = Flask(__name__)

# Configure CORS with additional options
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Range", "X-Content-Range"],
        "supports_credentials": True
    }
})

# MySQL configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'menu'
}

def get_db_connection():
    try:
        conn = mysql.connector.connect(**db_config)
        return conn
    except mysql.connector.Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

@app.route('/api/menu', methods=['POST', 'OPTIONS'])
def add_menu_item():
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = jsonify({'message': 'OK'})
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response

    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided"}), 400

        required_fields = ['name', 'description', 'category', 'price', 'prepTime', 'image']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

        name = data['name']
        description = data['description']
        category = data['category']
        price = data['price']
        prep_time = data['prepTime']
        image = data['image']  # Get image data (base64 string)
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = conn.cursor()

        try:
            query = """
            INSERT INTO menuitems (name, description, category, price, preparation_time, image, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(query, (name, description, category, price, prep_time, image, timestamp, timestamp))
            conn.commit()

            return jsonify({
                "message": "Menu item added successfully!",
                "item": {
                    "name": name,
                    "description": description,
                    "category": category,
                    "price": price,
                    "prepTime": prep_time,
                    "image": image  # Return the image data
                }
            }), 201

        except mysql.connector.Error as e:
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        finally:
            cursor.close()
            conn.close()

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500



@app.route('/api/menu', methods=['GET'])
def get_menu_items():
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = conn.cursor(dictionary=True)

        try:
            query = """
            SELECT id, name, description, category, price, 
                   preparation_time AS prepTime, image 
            FROM menuitems
            """
            cursor.execute(query)
            menu_items = cursor.fetchall()

            # Process each item to handle the image
            for item in menu_items:
                if item['image']:
                    # Check if the base64 string already has the data URL prefix
                    if not item['image'].startswith('data:image'):
                        item['image'] = f'data:image/jpeg;base64,{item["image"]}'

            return jsonify(menu_items), 200

        except mysql.connector.Error as e:
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        finally:
            cursor.close()
            conn.close()

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500
    

from datetime import datetime
import mysql.connector
from flask import request, jsonify
import base64

@app.route('/api/menu/<int:item_id>', methods=['PUT'])
def update_menu_item(item_id):
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided"}), 400

        required_fields = ['name', 'description', 'category', 'price', 'prepTime']
        missing_fields = [field for field in required_fields if not data.get(field)]

        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

        # Extract fields
        name = data['name']
        description = data['description']
        category = data['category']
        price = data['price']
        prep_time = data['prepTime']
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # Connect to the database
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = conn.cursor()

        try:
            # Update query without the image field
            query = """
            UPDATE menuitems
            SET name = %s, description = %s, category = %s, price = %s, preparation_time = %s, updated_at = %s
            WHERE id = %s
            """
            cursor.execute(query, (name, description, category, price, prep_time, timestamp, item_id))
            conn.commit()

            if cursor.rowcount == 0:
                return jsonify({"error": "Menu item not found"}), 404

            return jsonify({
                "message": "Menu item updated successfully!",
                "item": {
                    "id": item_id,
                    "name": name,
                    "description": description,
                    "category": category,
                    "price": price,
                    "prepTime": prep_time,
                    "image": None  # Ensure image is not updated
                }
            }), 200

        except mysql.connector.Error as e:
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        finally:
            cursor.close()
            conn.close()

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500



@app.route('/api/menu/<int:item_id>', methods=['DELETE'])
def delete_menu_item(item_id):
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = conn.cursor()

        try:
            # Delete query
            query = "DELETE FROM menuitems WHERE id = %s"
            cursor.execute(query, (item_id,))
            conn.commit()

            if cursor.rowcount == 0:
                return jsonify({"error": "Menu item not found"}), 404

            return jsonify({
                "message": "Menu item deleted successfully!",
                "id": item_id
            }), 200

        except mysql.connector.Error as e:
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        finally:
            cursor.close()
            conn.close()

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)




