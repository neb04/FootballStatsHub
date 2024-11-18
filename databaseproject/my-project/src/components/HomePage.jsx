import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DisplayData from './DisplayData';

export default function HomePage() {
    const divisionMap = {
        'NFC North': 1,
        'NFC South': 2,
        'NFC East': 3,
        'NFC West': 4,
        'AFC North': 5,
        'AFC South': 6,
        'AFC East': 7,
        'AFC West': 8
    };

    const getDivisionName = (divisionID) => {
        switch (Number(divisionID)) {
            case 1: return 'NFC North';
            case 2: return 'NFC South';
            case 3: return 'NFC East';
            case 4: return 'NFC West';
            case 5: return 'AFC North';
            case 6: return 'AFC South';
            case 7: return 'AFC East';
            case 8: return 'AFC West';
            default: return '';
        }
    };

    const getDivisionID = (divisionName) => divisionMap[divisionName] || '';

    const [selectedTab, setSelectedTab] = useState('Team');
    const [insertType, setInsertType] = useState('Team');
    const [filters, setFilters] = useState({
        type: 'Team',
        team_Name: '',
        name: '',
        divisionID: '',
        position: '',
        revenue__gte: '',
        revenue__lte: '',
        age__lte: '',
        age__gte: '',
    });
    const [insertPlayerVals, setInsertPlayerVals] = useState({
        playerID : '',
        f_Name :'',
        l_Name :'',
        player_Number : '',
        team_ID :'',
        position :'',
        status :'',
        height_in: '',
        weight : '',
        starting_Year:  '',
        age: '',
    });
    const [insertTeamVals, setInsertTeamVals] = useState({
        teamID:'',
        team_Name:'',
        coachID:'',
        divisionID:'',
        location:'',
        ownerID:'',
        general_manager:'',
        revenue:'',
        team_color:''
    });
    const [searchResults, setSearchResults] = useState([]);
    const [nflTeams, setNflTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedResult, setSelectedResult] = useState(null);
    const [teamMap, setTeamMap] = useState({});
    const [teamIDMap, setTeamIDMap] = useState({});

    useEffect(() => {
        // Function to fetch team map from the API
        const fetchTeamMap = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/teamMap');
                if (!response.ok) {
                    throw new Error('Failed to fetch team map: ' + response.statusText);
                }
                const data = await response.json();
                setTeamMap(data); // Update state with the fetched team map
                console.log(teamMap);
            } catch (error) {
                console.error('Error fetching team map:', error);
                setTeamMap({}); // Set to empty object in case of error
            }
        };

        fetchTeamMap();
    }, []); // Empty dependency array to run only once on mount

    useEffect(() => {
        // Function to fetch team map from the API
        const fetchTeamIDMap = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/teamIDMap');
                if (!response.ok) {
                    throw new Error('Failed to fetch team map: ' + response.statusText);
                }
                const data = await response.json();
                setTeamIDMap(data); // Update state with the fetched team map
                console.log('map: ',teamIDMap);
            } catch (error) {
                console.error('Error fetching team map:', error);
                setTeamIDMap({}); // Set to empty object in case of error
            }
        };

        fetchTeamIDMap();
    }, []); // Empty dependency array to run only once on mount

    useEffect(() => {
        const fetchTeamNames = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('http://localhost:5000/api/teamNames');
                setNflTeams(response.data);
            } catch (error) {
                console.error('Error fetching team names:', error);
                setNflTeams([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeamNames();
    }, []);

    const nflDivisions = [
        'AFC East', 'AFC North', 'AFC South', 'AFC West',
        'NFC East', 'NFC North', 'NFC South', 'NFC West'
    ];

    const queryTypes = ['Team', 'Player'];
    const positions = ['offense','defense','Quarterback','RunningBack','WideReceiver'];

    const handleTabChange = (tab) => {
        setSelectedTab(tab);

        // Clear appropriate filters based on the selected tab
        if (tab === 'Team') {
            const fetchTeamNames = async () => {
                try {
                    setIsLoading(true);
                    const response = await axios.get('http://localhost:5000/api/teamNames');
                    setNflTeams(response.data);
                } catch (error) {
                    console.error('Error fetching team names:', error);
                    setNflTeams([]);
                } finally {
                    setIsLoading(false);
                }
            };
    
            fetchTeamNames();

            setFilters(prev => ({
                ...prev,
                type: 'Team',
                name: '',
                divisionID: '',
                revenue__gte: '',
                revenue__lte: ''
            }));
        } else if (tab === 'Player') {
            setFilters(prev => ({
                ...prev,
                type: 'Player',
                team_Name: '',
                divisionID: '',
                revenue__gte: '',
                revenue__lte: ''
            }));
        } else if (tab === 'Advanced Filters') {
            setFilters(prev => ({
                ...prev,
                team_Name: '',
                name: '',
            }));
        }

        // Clear search results when switching tabs
        setSearchResults([]);
        setSelectedResult(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'divisionID') {
            setFilters(prev => ({
                ...prev,
                divisionID: getDivisionID(value)
            }));
        } else {
            setFilters(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleInsertChange = (e) => {
        const { name, value } = e.target;
        if(insertType === 'Team') {
            setInsertTeamVals(prev => ({
                ...prev,
                [name]: value
            }));
        } else if(insertType === 'Player') {
            if(name=='team_ID') {
                setInsertPlayerVals(prev => ({
                    ...prev,
                    [name]: teamMap[value]
                }));
                console.log('changed: ', name, ' ', teamMap[value]);
            } else {
                setInsertPlayerVals(prev => ({
                    ...prev,
                    [name]: value
                }));
                console.log('changed: ', name, ' ', value);
            }
        }
        
    };

    const handleInsertTypeChange = (e) => {
        const { name, value } = e.target;

        setInsertType(value);
    };


    const handleReset = () => {
        setFilters({
            type: 'Team',
            team_Name: '',
            name: '',
            divisionID: '',
            position: '',
            revenue__gte: '',
            revenue__lte: '',
            age__lte: '',
            age__gte: ''
        });
        setSelectedTab('Team');
        setSearchResults([]);
        setSelectedResult(null);
    };

    const handleSearch = async () => {
        try {
            var response;
            
            if(selectedTab==='Advanced Filters') {
                response = await axios.get('http://localhost:5000/api', {
                    params: filters,
                });
            } else if(selectedTab==='Player') {
                response = await axios.get('http://localhost:5000/api/player', {
                    params: {name: filters.name},
                });
            } else { // Team tab is selected
                response = await axios.get('http://localhost:5000/api', {
                    params: filters,
                });
            }
            setSearchResults(response.data);
            setSelectedResult(null); // Clear previously selected result
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const handleResultSelect = (result) => {
        console.log(result);
        setSelectedResult(result);
    };

    return (
        <main className="flex-1 p-4 flex flex-col gap-3 text-center sm:gap-4 justify-center pb-20">
            <h1 className="font-semibold text-5xl sm:text-6xl md:text-7xl">
                Football <span className="text-red-600 bold">Stats</span>
                <span className="font-bold text-5xl sm:text-6xl md:text-7xl"> Hub</span>
            </h1>
            <h3 className="font-medium md:text-lg">
                Search <span className="text-red-600">&rarr;</span> Analyze{' '}
                <span className="text-red-600">&rarr;</span> Repeat
            </h3>

            <div className="flex items-center justify-center gap-2 mt-4">
                <button
                    onClick={() => handleTabChange('Team')}
                    className={`px-4 py-2 rounded-full ${selectedTab === 'Team' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                >
                    Team
                </button>
                <button
                    onClick={() => handleTabChange('Player')}
                    className={`px-4 py-2 rounded-full ${selectedTab === 'Player' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                >
                    Player
                </button>
                <button
                    onClick={() => handleTabChange('Advanced Filters')}
                    className={`px-4 py-2 rounded-full ${selectedTab === 'Advanced Filters' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                >
                    Advanced Filters
                </button>
                <button
                    onClick={() => handleTabChange('Insert')}
                    className={`px-4 py-2 rounded-full ${selectedTab === 'Insert' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                >
                    Insert
                </button>
            </div>

            <div className="my-4">
                {selectedTab === 'Team' ? (
                    isLoading ? (
                        <div>Loading teams...</div>
                    ) : (
                        <select
                            name="team_Name"
                            value={filters.team_Name}
                            onChange={handleChange}
                            className="p-3 rounded-md shadow-md w-full max-w-md"
                        >
                            <option value="">Select a Team</option>
                            {nflTeams.map((team, index) => (
                                <option key={index} value={team}>
                                    {team}
                                </option>
                            ))}
                        </select>
                    )
                ) : selectedTab === 'Player' ? (
                    <input
                        type="text"
                        name="name"
                        value={filters.name}
                        onChange={handleChange}
                        placeholder="Enter Player Name"
                        className="p-3 rounded-md shadow-md w-full max-w-md"
                    />
                ) : selectedTab === 'Advanced Filters' ? (
                    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mx-auto">
                        <h2 className="text-xl font-semibold mb-4">Advanced Filters</h2>
                        <div className="flex flex-col gap-4">
                            {/* Dropdown for Query Type */}
                            <select
                                name="type"
                                value={filters.type}
                                onChange={handleChange}
                                className="p-3 rounded-md shadow-md w-full max-w-md"
                            >
                                <option value="">Select Query Type</option>
                                {queryTypes.map((type, index) => (
                                    <option key={index} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>

                            {/* Conditionally Render Filters Based on Type */}
                            {filters.type === "Team" && (
                                <>
                                    <select
                                        name="divisionID"
                                        value={getDivisionName(filters.divisionID)}
                                        onChange={handleChange}
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    >
                                        <option value="">Select a Division</option>
                                        {nflDivisions.map((division, index) => (
                                            <option key={index} value={division}>
                                                {division}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        name="revenue__gte"
                                        value={filters.revenue__gte}
                                        onChange={handleChange}
                                        placeholder="Minimum Revenue"
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    />
                                    <input
                                        type="number"
                                        name="revenue__lte"
                                        value={filters.revenue__lte}
                                        onChange={handleChange}
                                        placeholder="Maximum Revenue"
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    />
                                </>
                            )}

                            {filters.type === "Player" && (
                                <>
                                    <select
                                        name="team_Name"
                                        value={filters.team_Name}
                                        onChange={handleChange}
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    >
                                        <option value="">Select a Team</option>
                                        {nflTeams.map((team, index) => (
                                            <option key={index} value={team}>
                                                {team}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        name="position"
                                        value={filters.position}
                                        onChange={handleChange}
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    >
                                        <option value="">Select a Position</option>
                                        {positions.map((position, index) => (
                                            <option key={index} value={position}>
                                                {position}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        name="age__gte"
                                        value={filters.age__gte}
                                        onChange={handleChange}
                                        placeholder="Minimum Age"
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    />
                                    <input
                                        type="number"
                                        name="age__lte"
                                        value={filters.age__lte}
                                        onChange={handleChange}
                                        placeholder="Maximum Age"
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    />
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mx-auto">
                        <h2 className="text-xl font-semibold mb-4">Insert</h2>
                        <div className="flex flex-col gap-4">
                            {/* Dropdown for Query Type */}
                            <select
                                name="insertType"
                                value={insertType}
                                onChange={handleInsertTypeChange}
                                className="p-3 rounded-md shadow-md w-full max-w-md"
                            >
                                <option value="">Select Insert Type</option>
                                {queryTypes.map((type, index) => (
                                    <option key={index} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>

                            {/* Conditionally Render Filters Based on Type 
                            teamID:'',
                            team_Name:'',
                            coachID:'',
                            divisionID:'',
                            location:'',
                            ownerID:'',
                            general_manager:'',
                            revenue:'',
                            team_color:''
                            */}
                            {insertType === "Team" && (
                                <>
                                    <input
                                        type="number"
                                        name="teamID"
                                        value={insertTeamVals.teamID}
                                        onChange={handleInsertChange}
                                        placeholder="Team ID"
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    />
                                    <input
                                        type="text"
                                        name="team_Name"
                                        value={insertTeamVals.team_Name}
                                        onChange={handleInsertChange}
                                        placeholder="Team Name"
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    />
                                    <input
                                        type="number"
                                        name="coachID"
                                        value={insertTeamVals.coachID}
                                        onChange={handleInsertChange}
                                        placeholder="Coach"
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    />
                                    <select
                                        name="divisionID"
                                        value={insertTeamVals.divisionID}
                                        onChange={handleInsertChange}
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    >
                                        <option value="">Select a Division</option>
                                        {nflDivisions.map((division, index) => (
                                            <option key={index} value={divisionMap[division]}>
                                                {division}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        name="location"
                                        value={insertTeamVals.location}
                                        onChange={handleInsertChange}
                                        placeholder="Location"
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    />
                                    <input
                                        type="text"
                                        name="ownerID"
                                        value={insertTeamVals.ownerID}
                                        onChange={handleInsertChange}
                                        placeholder="Owner"
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    />
                                    <input
                                        type="text"
                                        name="general_manager"
                                        value={insertTeamVals.general_manager}
                                        onChange={handleInsertChange}
                                        placeholder="General Manager"
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    />
                                    <input
                                        type="number"
                                        name="Revenue"
                                        value={insertTeamVals.revenue}
                                        onChange={handleInsertChange}
                                        placeholder="Revenue"
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    />
                                    <input
                                        type="text"
                                        name="team_color"
                                        value={insertTeamVals.team_color}
                                        onChange={handleInsertChange}
                                        placeholder="Team Color"
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    />
                                    
                                    
                                </>
                            )}
                            {/*playerID f_Name l_Name player_Number team_ID position status height_in weight starting_Year age */}
                            {insertType === "Player" && (
                                <>
                                    <input
                                        type="number"
                                        name="playerID"
                                        value={insertPlayerVals.playerID}
                                        onChange={handleInsertChange}
                                        placeholder="Player ID"
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    />
                                    <input
                                        type="text"
                                        name="f_Name"
                                        value={insertPlayerVals.f_Name}
                                        onChange={handleInsertChange}
                                        placeholder="First Name"
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    />
                                    <input
                                        type="text"
                                        name="l_Name"
                                        value={insertPlayerVals.l_Name}
                                        onChange={handleInsertChange}
                                        placeholder="Last Name"
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    />
                                    <input
                                        type="number"
                                        name="player_Number"
                                        value={insertPlayerVals.player_Number}
                                        onChange={handleInsertChange}
                                        placeholder="Player Number"
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    />
                                    <select
                                        name="team_ID"
                                        value={teamIDMap[insertPlayerVals.team_ID]}
                                        onChange={handleInsertChange}
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    >
                                        <option value="">Select a Team</option>
                                        {nflTeams.map((team, index) => (
                                            <option key={index} value={team}>
                                                {team}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        name="position"
                                        value={insertPlayerVals.position}
                                        onChange={handleInsertChange}
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    >
                                        <option value="">Select a Position</option>
                                        {positions.map((position, index) => (
                                            <option key={index} value={position}>
                                                {position}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        name="height_in"
                                        value={insertPlayerVals.height_in}
                                        onChange={handleChange}
                                        placeholder="Height (in)"
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    />
                                    <input
                                        type="number"
                                        name="weight"
                                        value={insertPlayerVals.weight}
                                        onChange={handleChange}
                                        placeholder="Weight"
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    />
                                    <input
                                        type="number"
                                        name="starting_Year"
                                        value={insertPlayerVals.starting_Year}
                                        onChange={handleChange}
                                        placeholder="Starting Year"
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    />
                                    <input
                                        type="number"
                                        name="age"
                                        value={insertPlayerVals.age}
                                        onChange={handleChange}
                                        placeholder="Age"
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    />
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-between mt-4">
                <button onClick={handleReset} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md">
                    Reset
                </button>
                <button onClick={handleSearch} className="px-4 py-2 bg-blue-600 text-white rounded-md">
                    Search
                </button>
            </div>

            <div className="mt-6">
    <h2 className="text-xl font-bold">Search Results</h2>
    {searchResults.length > 0 ? (
        <ul className="mt-4">
            {searchResults.map((result, index) => (
                <li key={index} className="p-4 border-b border-gray-300 flex justify-between items-center">
                    <div>
                        {selectedTab === 'Team' ? (
                            // Display Team data
                            <>
                                <p>
                                    <strong>Team:</strong> {result.team_Name}
                                </p>
                                <p>
                                    <strong>Division:</strong> {getDivisionName(result.divisionID)}
                                </p>
                                <p>
                                    <strong>Revenue:</strong> ${result.revenue}
                                </p>
                            </>
                        ) : selectedTab === 'Player' ? (
                            // Display Player data
                            <>
                                <p>
                                    <strong>Name:</strong> {result.f_Name + ' ' + result.l_Name}
                                </p>
                                <p>
                                    <strong>Team:</strong> {result.location + ' ' + result.team_Name}
                                </p>
                                <p>
                                    <strong>Player Number:</strong> {result.player_Number}
                                </p>
                            </>
                        ) : filters.type == 'Team' ? (
                            // Display Team data
                            <>
                                <p>
                                    <strong>Team:</strong> {result.team_Name}
                                </p>
                                <p>
                                    <strong>Division:</strong> {getDivisionName(result.divisionID)}
                                </p>
                                <p>
                                    <strong>Revenue:</strong> ${result.revenue}
                                </p>
                            </>
                        ) : filters.type == 'Player' ? (
                            // Display Player data
                            <>
                                <p>
                                    <strong>Name:</strong> {result.f_Name + ' ' + result.l_Name}
                                </p>
                                <p>
                                    <strong>Team:</strong> {result.location + ' ' + result.team_Name}
                                </p>
                                <p>
                                    <strong>Age:</strong> {result.age}
                                </p>
                            </>
                        ) : null}
                    </div>
                    <button
                        onClick={() => handleResultSelect(result)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Select
                    </button>
                </li>
            ))}
        </ul>
    ) : (
        <p className="mt-4 text-gray-500">No results found</p>
    )}
</div>


            {selectedResult && <DisplayData data={selectedResult} />}
        </main>
    );
}
