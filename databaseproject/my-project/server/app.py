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
        'Team': ['teamID', 'team_Name', 'coachID', 'divisionID', 'location', 'ownerID', 'general_manager', 'revenue', 'team_color', 'sacks', 'interceptions', 'touchdowns', 'tackles_for_loss', 'total_tackles', 'stuffs'],
        'Player': ['playerID', 'f_Name', 'l_Name', 'player_Number', 'team_ID', 'position', 'status', 'height_in', 'weight', 'starting_Year', 'age','pass_yards', 'pass_att', 'pass_completions', 'touchdowns', 'interceptions', 'rushing_att', 'rushing_yards', 'fumbles', 'times_sacked', 'target', 'receptions', 'yards', 'fumble', 'kick_return', 'drops', 'rush_att', 'rushing_yards', 'rush_touchdown', 'rec_target', 'rec_yards', 'rec_touchdowns']
    }

    if table_name not in allowed_tables:
        return {'error': 'Invalid table name'}, 400

    try:
        
        query = f"SELECT * FROM {table_name} "
        if filters['type']=='Team':
            query += "JOIN Defense ON Defense.teamID = Team.teamID JOIN TeamRecord ON TeamRecord.teamID = Team.teamID JOIN Coach ON Team.coachID = Coach.coachID "
        elif filters['type']=='Player':
            if filters['position']=='Quarterback':
                query += " JOIN Quarterback ON Quarterback.playerID = Player.playerID "
            elif filters['position']=='RunningBack':
                query += " JOIN RunningBack ON RunningBack.playerID = Player.playerID "
            elif filters['position']=='WideReceiver':
                query += " JOIN WideReceiver ON WideReceiver.playerID = Player.playerID "
        query += "WHERE 1=1 "
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
        #input()
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
    name = filters.get('name', '')
    
    query = f"""
    SELECT Player.*, Team.location, Team.team_Name
    FROM Player
    LEFT JOIN Team ON Team.teamID = Player.team_ID
    WHERE CONCAT(Player.f_Name, ' ', Player.l_Name) LIKE '%{name}%';
    """
    print('Query: ', query)
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(query)
        results = cursor.fetchall()

        # Add position-specific data
        for player in results:
            position = player.get('position')
            if position in ['Quarterback', 'RunningBack', 'WideReceiver']:
                position_query = f"""
                SELECT * FROM {position}
                WHERE playerID = %s;
                """
                cursor.execute(position_query, (player['playerID'],))
                position_data = cursor.fetchone()
                if position_data:
                    # Merge position-specific data into the player entry
                    player.update(position_data)

        cursor.close()
        conn.close()
        print('Results: ', results)
        return jsonify(results)
    except Exception as e:
        print(f'Error: {e}')
        return jsonify({'error': 'Error while fetching data'}), 500
    

@app.route('/api', methods=['GET'])
def get_query():
    filters = request.args.to_dict()
    print(filters)
    #input()
    result = query_table(filters['type'], filters)
    print('result: ', result)
    return result

@app.route('/api/teamMap', methods=['GET'])
def get_team_map():
    conn = get_db_connection()
    query = "SELECT location, team_Name, teamID FROM Team"
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(query)
        results = cursor.fetchall()
        
        # Transform the results into the desired format
        team_map = {f"{row['location']} {row['team_Name']}": row['teamID'] for row in results}
        print(team_map)
        cursor.close()
        conn.close()
        return team_map
    except Error as e:
        print(f"Error querying table Team: {e}")
        return {'error': 'Failed to query table'}, 500

@app.route('/api/teamIDMap', methods=['GET'])
def get_team__ID_map():
    conn = get_db_connection()
    query = "SELECT location, team_Name, teamID FROM Team"
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(query)
        results = cursor.fetchall()
        
        # Transform the results into the desired format
        team_map = {row['teamID']: f"{row['location']} {row['team_Name']}" for row in results}
        print(team_map)
        cursor.close()
        conn.close()
        return team_map
    except Error as e:
        print(f"Error querying table Team: {e}")
        return {'error': 'Failed to query table'}, 500

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

@app.route('/api/edit', methods=['POST'])
def edit_data():
    try:
        # Get the JSON data from the request
        data = request.get_json()
        print(data)
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Check if playerID or teamID is present
        if 'originalPlayerID' in data:
            table = 'Player'
            identifier = 'playerID'
            original_id = data['originalPlayerID']
            new_id = data.get('playerID')

            # Mapping of positions to their specific fields
            position_tables = {
                'RunningBack': ['rush_att', 'rushing_yards', 'rush_touchdown', 'rec_target', 'rec_yards', 'rec_touchdowns', 'fumble'],
                'WideReceiver': ['target', 'receptions', 'yards', 'touchdowns', 'fumble', 'kick_return', 'drops'],
                'Quarterback': ['pass_yards', 'pass_att', 'pass_completions', 'touchdowns', 'interceptions', 'rushing_att', 'rushing_yards', 'fumbles', 'times_sacked']
            }

            # Infer position if not provided
            position = data.get('position')
            if not position:
                for pos, fields in position_tables.items():
                    if any(field in data for field in fields):
                        position = pos
                        break
            """
            if not position:
                return jsonify({
                    'success': False,
                    'message': 'Position-specific fields detected, but position is not provided'
                }), 400
            """
            # Update Player table
            player_fields = {k: v for k, v in data.items() if k not in ['position', 'originalPlayerID'] and k not in position_tables.get(position, [])}
            update_fields = {k: v for k, v in player_fields.items() if k != identifier}

            if update_fields:
                set_clause = ', '.join([f"{key} = %s" for key in update_fields.keys()])
                sql_query = f"UPDATE {table} SET {set_clause} WHERE {identifier} = %s"
                print(sql_query)
                cursor.execute(sql_query, list(update_fields.values()) + [original_id])
                conn.commit()

            # Update position-specific table
            position_fields = {k: v for k, v in data.items() if k in position_tables.get(position, [])}
            if position_fields:
                set_clause = ', '.join([f"{key} = %s" for key in position_fields.keys()])
                sql_query = f"UPDATE {position} SET {set_clause} WHERE {identifier} = %s"
                print(sql_query)
                cursor.execute(sql_query, list(position_fields.values()) + [original_id])
                conn.commit()

            # Handle ID change
            if new_id and new_id != original_id:
                sql_query = f"UPDATE {table} SET {identifier} = %s WHERE {identifier} = %s"
                cursor.execute(sql_query, [new_id, original_id])
                conn.commit()

        elif 'originalTeamID' in data:
            table = 'Team'
            identifier = 'teamID'
            original_id = data['originalTeamID']
            new_id = data.get('teamID')

            # Define defense stats columns
            defense_columns = ['sacks', 'interceptions', 'touchdowns', 'tackles_for_loss', 'total_tackles', 'stuffs']
            record_columns = ['standing', 'record']
            coach_columns = ['coach_f_Name', 'coach_l_Name', 'coach_age']

            # Separate Team and Defense fields
            team_fields = {k: v for k, v in data.items() if k not in defense_columns and k not in record_columns and k not in coach_columns and k not in ['originalTeamID']}
            defense_fields = {k: v for k, v in data.items() if k in defense_columns}
            record_fields = {k: v for k, v in data.items() if k in record_columns}
            coach_fields = {k: v for k, v in data.items() if k in coach_columns}

            # Update Team table
            if team_fields:
                set_clause = ', '.join([f"{key} = %s" for key in team_fields.keys()])
                sql_query = f"UPDATE {table} SET {set_clause} WHERE {identifier} = %s"
                
                cursor.execute(sql_query, list(team_fields.values()) + [original_id])
                conn.commit()

            # Update Defense table
            if defense_fields:
                set_clause = ', '.join([f"{key} = %s" for key in defense_fields.keys()])
                sql_query = f"UPDATE Defense SET {set_clause} WHERE {identifier} = %s"

                cursor.execute(sql_query, list(defense_fields.values()) + [original_id])
                conn.commit()

            # Update Record Table
            if record_fields:
                set_clause = ', '.join([f"{key} = %s" for key in record_fields.keys()])
                sql_query = f"UPDATE TeamRecord SET {set_clause} WHERE {identifier} = %s"

                cursor.execute(sql_query, list(record_fields.values()) + [original_id])
                conn.commit()
            
            # Update Coach Table
            if coach_fields:
                set_clause = ', '.join([f"{key} = %s" for key in coach_fields.keys()])
                sql_query = f"UPDATE Coach SET {set_clause} WHERE coachID = %s"

                cursor.execute(sql_query, list(coach_fields.values()) + [data['coachID']])
                conn.commit()

            # Handle ID change
            if new_id and new_id != original_id:
                sql_query = f"UPDATE {table} SET {identifier} = %s WHERE {identifier} = %s"
                cursor.execute(sql_query, [new_id, original_id])
                conn.commit()

        else:
            return jsonify({
                'success': False,
                'message': 'Neither originalPlayerID nor originalTeamID provided'
            }), 400

        cursor.close()
        conn.close()

        return jsonify({
            'success': True,
            'message': 'Record updated successfully',
            'updated_fields': data
        })

    except Exception as e:
        print(f'Error: {e}')
        return jsonify({
            'success': False,
            'message': 'An error occurred while editing the data',
            'error': str(e)
        }), 500

@app.route('/api/delete', methods=['POST'])
def delete_entry():
    try:
        data = request.get_json()
        print(data)
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = 'DELETE FROM '
        if 'playerID' in data:
            identifier = 'playerID'
            identifierval = data[identifier]
            tableName = 'Player'
        elif 'teamID' in data:
            identifier = 'teamID'
            identifierval = data[identifier]
            tableName = 'Team'
        else:
            return jsonify({
                'success': False,
                'message': 'Neither playerID nor teamID provided'
            }), 400
        query += f'{tableName} WHERE {identifier} = {identifierval}'
        cursor.execute(query)
        conn.commit()
        return jsonify({
            'success': True,
            'message': f'Record with {identifier} {identifierval} deleted successfully'
        })

    except Error as e:
        print(f'Error: {e}')
        return jsonify({
            'success': False,
            'message': 'An error occurred while deleting the record',
            'error': str(e)
        }), 500

@app.route('/api/insert/team', methods=['POST'])
def insert_team():
    try:
        data = request.get_json()
        print(data)
        query = "INSERT INTO Team("
        cols = []
        fields = []

        if(data['teamID']==''):
            data['teamID'] = getFreeIndex('Team')
        """
        new team: teamID -> all team fields (if teamID blank then generate one)
        teamRecord -> teamID then blank
        defense -> teamID then blank
        teamowner -> check if name already exists, set id if so, otherwise make new entry with new id
        coach -> check if name already exists, set id if so, otherwise make new entry with id
        """
        specialCols = ['coachID', 'ownerID']
        
        for k,v in data.items():
            if k not in specialCols and v!='':
                cols.append(k)
                fields.append(v)
        print(cols)
        print(fields)
        print('team name: ', data['team_Name'])
        if data['team_Name'] =='':
            return jsonify({
                    'success': False,
                    'message': 'Team name cannot be blank'
                }), 400
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        if data['coachID'] != '':
            #coachID is string, ideally First Last
            data['coachID'] = data['coachID'].strip("'")
            print(f"SELECT * FROM Coach WHERE CONCAT(coach_f_Name, ' ', coach_l_Name) LIKE '%{data['coachID']}%'")
            cursor.execute(f"SELECT * FROM Coach WHERE CONCAT(coach_f_Name, ' ', coach_l_Name) LIKE '%{data['coachID']}%'")
            result = cursor.fetchone()
            if result is None:
                newid = getFreeIndex('Coach')
                cursor.execute(f"INSERT INTO Coach(coachID, coach_f_Name, coach_l_Name) VALUES(%s, %s, %s)", (newid, data['coachID'].split(' ')[0], data['coachID'].split(' ')[1]))
                conn.commit()
                data['coachID'] = newid
                print('coachID: ', data['coachID'])
            else:
                data['coachID'] = result['coachID']
                print('coachID: ', data['coachID'])
            cols.append('coachID')
            fields.append(data['coachID'])
        #handle ownerID
        if data['ownerID'] != '':
            data['ownerID'] = data['ownerID'].strip("'")
            print(f"SELECT * FROM TeamOwner WHERE CONCAT(owner_f_Name, ' ', owner_l_Name) LIKE '%{data['ownerID']}%'")
            cursor.execute(f"SELECT * FROM TeamOwner WHERE CONCAT(owner_f_Name, ' ', owner_l_Name) LIKE '%{data['ownerID']}%'")
            result = cursor.fetchone()
            if result is None:
                newid = getFreeIndex('TeamOwner', 'ownerID')
                print(f"INSERT INTO TeamOwner(ownerID, owner_f_Name, owner_l_Name) VALUES({newid}, {data['ownerID'].split(' ')[0]}, {data['ownerID'].split(' ')[1]})")
                cursor.execute(f"INSERT INTO TeamOwner(ownerID, owner_f_Name, owner_l_Name) VALUES(%s, %s, %s)", (newid, data['ownerID'].split(' ')[0], data['ownerID'].split(' ')[1]))
                conn.commit()
                
                data['ownerID'] = newid
                print('ownerID: ', data['ownerID'])
            else:
                data['ownerID'] = result['ownerID']
                print('ownerID: ', data['ownerID'])
            cols.append('ownerID')
            fields.append(data['ownerID'])
        
        query = "INSERT INTO Team("
        query += (', '.join([f"{col}" for col in cols]))
        query += ') VALUES('
        query += (', '.join([f"'{field}'" for field in fields]))
        query += ');'
        cursor.execute(query)
        conn.commit()

        return jsonify({
            'success': True,
            'message': f'Record inserted successfully!'
        })

    except Error as e:
        print(f'Error: {e}')
        return jsonify({
            'success': False,
            'message': 'An error occurred while deleting the record',
            'error': str(e)
        }), 500

@app.route('/api/insert/player', methods=['POST'])
def insert_player():
    try:
        data = request.get_json()
        print(data)
        query = "INSERT INTO Player("
        cols = []
        fields = []

        if(data['playerID']==''):
            data['playerID'] = getFreeIndex('Player')
        """
        new player: playerID -> all player fields (if playerID blank, get new index using function)
        if position specific field (qb, rb, wr) make -> playerID then blank
        """
        for k,v in data.items():
            if v!='':
                cols.append(k)
                fields.append(v)
        """
        print('cols:',cols)
        print('fields:',fields)
        print(', '.join([f"{col}" for col in cols]))
        print(', '.join([f"{field}" for field in fields]))
        """
        query += (', '.join([f"{col}" for col in cols]))
        query += ') VALUES('
        query += (', '.join([f"'{field}'" for field in fields]))
        query += ');'
        print(query)
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(query)
        conn.commit()

        if data['position'] in ('Quarterback', 'WideReceiver', 'RunningBack'):
            query = f"INSERT INTO {data['position']}(playerID) VALUES('{data['playerID']}');"
            print(query)
            cursor.execute(query)
            conn.commit()


        cursor.close()
        conn.close()
        return jsonify({
            'success': True,
            'message': f'Record inserted successfully!'
        })

    except Error as e:
        print(f'Error: {e}')
        return jsonify({
            'success': False,
            'message': 'An error occurred while deleting the record',
            'error': str(e)
        }), 500

def getFreeIndex(table, key=''):
    if key=='':
        key = table+'ID'
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = f"SELECT MAX({key}) FROM {table};"
    cursor.execute(query)
    res = cursor.fetchone()
    res = list(res.values())[0]+1
    #print(res)
    return res

if __name__ == '__main__':
    app.run(debug=True)
