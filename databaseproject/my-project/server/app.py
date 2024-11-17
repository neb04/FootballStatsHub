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

def query_table(table_name, filters):
    conn = get_db_connection()
    if conn is None:
        return {'error': 'Database connection failed'}, 500

    # Define allowed tables and columns to prevent SQL injection
    allowed_tables = {
        'Team': ['teamID', 'team_Name', 'coachID', 'divisionID', 'location', 'ownerID', 'general_manager', 'revenue', 'team_color'],
        'Player': ['playerID', 'f_Name', 'l_Name', 'player_Number', 'team_ID', 'position', 'status', 'height_in', 'weight', 'starting_Year', 'age']
    }

    if table_name not in allowed_tables:
        return {'error': 'Invalid table name'}, 400

    try:
        query = f"SELECT * FROM {table_name} WHERE 1=1"
        params = []
        print(filters)
        # Dynamically construct query from filters
        for column, value in filters.items():
            if value=='':
                continue

            col_name = column
            operator = '='
            if 'team_Name' in column:
                value = value.split(" ")[-1]
            elif '__gte' in column:
                col_name = column.replace('__gte', '')
                operator = '>='
            elif '__lte' in column:
                col_name = column.replace('__lte', '')
                operator = '<='
            elif '__gt' in column:
                col_name = column.replace('__gt', '')
                operator = '>'
            elif '__lt' in column:
                col_name = column.replace('__lt', '')
                operator = '<'
            

            if col_name not in allowed_tables[table_name]:
                print("invalid column ", col_name)
                continue  # Skip invalid columns

            query += f" AND {col_name} {operator} \'{value}\'"
            #params.append(value)
        print('Query: ', query)
        cursor = conn.cursor(dictionary=True)
        #cursor.execute(query, params)
        cursor.execute(query)
        results = cursor.fetchall()
        
        cursor.close()
        conn.close()
        return results
    except Error as e:
        print(f"Error querying table {table_name}: {e}")
        return {'error': 'Failed to query table'}, 500

# API endpoint for Team table
@app.route('/api/team', methods=['GET'])
def get_team():
    filters = request.args.to_dict()
    result = query_table('Team', filters)
    return jsonify(result)

# API endpoint for Player table
@app.route('/api/player', methods=['GET'])
def get_player():
    filters = request.args.to_dict()
    result = query_table('Player', filters)
    return jsonify(result)

@app.route('/api', methods=['GET'])
def get_query():
    filters = request.args.to_dict()
    print(filters)
    result = query_table(filters['type'], filters)
    print('result: ', result)
    return result

@app.route('/api/teamNames', methods=['GET'])
def get_team_names():
    conn = get_db_connection()
    query = "SELECT location, team_Name FROM Team"
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(query)
        results = cursor.fetchall()
        
        # Transform the results into the desired format
        team_names = [f"{team['location']} {team['team_Name']}" for team in results]
        
        cursor.close()
        conn.close()
        return team_names
    except Error as e:
        print(f"Error querying table Team: {e}")
        return {'error': 'Failed to query table'}, 500


if __name__ == '__main__':
    app.run(debug=True)
