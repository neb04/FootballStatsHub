import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)
CORS(app)

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv("MYSQL_HOST"),
            port=os.getenv("MYSQL_PORT"),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_PASSWORD"),
            database=os.getenv("MYSQL_DB")
        )
        return connection
    except Error as e:
        print("Error connecting to MySQL", e)
        return None

# Fetch data
@app.route('/api/data/<string:tableName>', methods=['GET'])
def get_data(tableName):
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM " + tableName)
        rows = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(rows)
    else:
        return jsonify({'error': 'Failed to connect to database'})

# Insert data
@app.route('/api/data', methods=['POST'])
def add_data():
    data = request.get_json()
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor()
        cursor.execute("INSERT INTO your_table_name (col1, col2) VALUES (%s, %s)", (data['col1'], data['col2']))
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({'message': 'Data added successfully'})
    else:
        return jsonify({'error': 'Failed to connect to database'})

# Update data
@app.route('/api/data/<int:id>', methods=['PUT'])
def update_data(id):
    data = request.get_json()
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor()
        cursor.execute("UPDATE your_table_name SET col1 = %s WHERE id = %s", (data['col1'], id))
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({'message': 'Data updated successfully'})
    else:
        return jsonify({'error': 'Failed to connect to database'})

# Delete data
@app.route('/api/data/<int:id>', methods=['DELETE'])
def delete_data(id):
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor()
        cursor.execute("DELETE FROM your_table_name WHERE id = %s", (id,))
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({'message': 'Data deleted successfully'})
    else:
        return jsonify({'error': 'Failed to connect to database'})

if __name__ == '__main__':
    app.run(debug=True)