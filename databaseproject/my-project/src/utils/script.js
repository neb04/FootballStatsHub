// script.js

const teams = [
    {
        teamID: 1,
        team_Name: 'Arizona Cardinals',
        coachID: 101,
        division: 'NFC West',
        standing: 3,
        location: 'Arizona',
        ownerID: 201,
        general_manager: 'Steve Keim',
        revenue: 500000000,
        team_color: 'red',
        conference: 'NFC',
        record: '8-8'
    },
    {
        teamID: 2,
        team_Name: 'San Francisco 49ers',
        coachID: 102,
        division: 'NFC West',
        standing: 2,
        location: 'San Francisco',
        ownerID: 202,
        general_manager: 'John Lynch',
        revenue: 550000000,
        team_color: 'gold',
        conference: 'NFC',
        record: '10-6'
    }
];

const players = [
    {
        playerID: 1,
        f_Name: 'Kyler',
        l_Name: 'Murray',
        player_Number: 1,
        team_ID: 1,
        position: 'Qb',
        status: 'Active',
        height_ft: 5,
        height_in: 10,
        weight: 207,
        starting_Year: 2019,
        age: 25
    },
    {
        playerID: 2,
        f_Name: 'Marvin',
        l_Name: 'Harrison',
        player_Number: 18,
        team_ID: 1,
        position: 'Wr',
        status: 'Active',
        height_ft: 6,
        height_in: 4,
        weight: 205,
        starting_Year: 2024,
        age: 22
    },
    {
        playerID: 3,
        f_Name: 'Brock',
        l_Name: 'Purdy',
        player_Number: 13,
        team_ID: 2,
        position: 'Qb',
        status: 'Active',
        height_ft: 6,
        height_in: 1,
        weight: 225,
        starting_Year: 2022,
        age: 24
    },
    {
        playerID: 4,
        f_Name: 'George',
        l_Name: 'Kittle',
        player_Number: 85,
        team_ID: 2,
        position: 'Te',
        status: 'Active',
        height_ft: 6,
        height_in: 4,
        weight: 250,
        starting_Year: 2017,
        age: 30
    }
];

// Export as module
export { teams, players };

