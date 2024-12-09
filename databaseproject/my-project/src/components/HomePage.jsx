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
        } else if(name==='team_ID'){
            setFilters(prev => ({
                ...prev,
                [name]: teamMap[value]
            }));
        }
        else {
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

    const handleInsert = async () => {
        try {
            let endpoint = '';
            let data = {};
    
            if (insertType === 'Team') {
                endpoint = 'http://localhost:5000/api/insert/team';
                data = insertTeamVals;
            } else if (insertType === 'Player') {
                endpoint = 'http://localhost:5000/api/insert/player';
                data = insertPlayerVals;
            } else {
                console.error('Invalid insert type selected');
                return;
            }
    
            const response = await axios.post(endpoint, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.status === 200) {
                alert('Data inserted successfully');
            } else {
                console.error('Failed to insert data:', response.statusText);
            }
        } catch (error) {
            console.error('Error inserting data:', error);
            alert('An error occurred while inserting data.');
        }
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
        setInsertPlayerVals({
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
        setInsertTeamVals({
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
                                    <label>Defense Stats</label>
                                    <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                        <label htmlFor="sacks-range" className="block text-sm font-medium text-gray-700 mb-2">
                                            Sacks
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="number"
                                                name="sacks__gte"
                                                value={filters.sacks__gte}
                                                onChange={handleChange}
                                                placeholder="Min"
                                                className="p-2 border rounded-md w-20 text-center"
                                            />
                                            {/* Range Slider */}
                                            <input
                                                id="sacks-range"
                                                type="range"
                                                min="0"
                                                max="50"
                                                value={filters.sacks__gte}
                                                onChange={(e) =>
                                                    handleChange({ target: { name: 'sacks__gte', value: e.target.value } })
                                                }
                                                className="w-full"
                                            />
                                            <input
                                                id="sacks-range"
                                                type="range"
                                                min="0"
                                                max="50"
                                                value={filters.sacks__lte}
                                                onChange={(e) =>
                                                    handleChange({ target: { name: 'sacks__lte', value: e.target.value } })
                                                }
                                                className="w-full"
                                            />
                                            <input
                                                type="number"
                                                name="sacks__lte"
                                                value={filters.sacks__lte}
                                                onChange={handleChange}
                                                placeholder="Max"
                                                className="p-2 border rounded-md w-20 text-center"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                        <label htmlFor="interceptions-range" className="block text-sm font-medium text-gray-700 mb-2">
                                            Interceptions
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="number"
                                                name="interceptions__gte"
                                                value={filters.interceptions__gte}
                                                onChange={handleChange}
                                                placeholder="Min"
                                                className="p-2 border rounded-md w-20 text-center"
                                            />
                                            {/* Range Slider */}
                                            <input
                                                id="interceptions-range"
                                                type="range"
                                                min="0"
                                                max="25"
                                                value={filters.interceptions__gte}
                                                onChange={(e) =>
                                                    handleChange({ target: { name: 'interceptions__gte', value: e.target.value } })
                                                }
                                                className="w-full"
                                            />
                                            <input
                                                id="interceptions-range"
                                                type="range"
                                                min="0"
                                                max="25"
                                                value={filters.interceptions__lte}
                                                onChange={(e) =>
                                                    handleChange({ target: { name: 'interceptions__lte', value: e.target.value } })
                                                }
                                                className="w-full"
                                            />
                                            <input
                                                type="number"
                                                name="interceptions__lte"
                                                value={filters.interceptions__lte}
                                                onChange={handleChange}
                                                placeholder="Max"
                                                className="p-2 border rounded-md w-20 text-center"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                        <label htmlFor="touchdowns-range" className="block text-sm font-medium text-gray-700 mb-2">
                                            Touchdowns
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="number"
                                                name="touchdowns__gte"
                                                value={filters.touchdowns__gte}
                                                onChange={handleChange}
                                                placeholder="Min"
                                                className="p-2 border rounded-md w-20 text-center"
                                            />
                                            {/* Range Slider */}
                                            <input
                                                id="touchdowns-range"
                                                type="range"
                                                min="0"
                                                max="25"
                                                value={filters.touchdowns__gte}
                                                onChange={(e) =>
                                                    handleChange({ target: { name: 'touchdowns__gte', value: e.target.value } })
                                                }
                                                className="w-full"
                                            />
                                            <input
                                                id="touchdowns-range"
                                                type="range"
                                                min="0"
                                                max="25"
                                                value={filters.touchdowns__lte}
                                                onChange={(e) =>
                                                    handleChange({ target: { name: 'touchdowns__lte', value: e.target.value } })
                                                }
                                                className="w-full"
                                            />
                                            <input
                                                type="number"
                                                name="touchdowns__lte"
                                                value={filters.touchdowns__lte}
                                                onChange={handleChange}
                                                placeholder="Max"
                                                className="p-2 border rounded-md w-20 text-center"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                        <label htmlFor="tackles_for_loss-range" className="block text-sm font-medium text-gray-700 mb-2">
                                            Tackles For Loss
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="number"
                                                name="tackles_for_loss__gte"
                                                value={filters.tackles_for_loss__gte}
                                                onChange={handleChange}
                                                placeholder="Min"
                                                className="p-2 border rounded-md w-20 text-center"
                                            />
                                            {/* Range Slider */}
                                            <input
                                                id="tackles_for_loss-range"
                                                type="range"
                                                min="0"
                                                max="50"
                                                value={filters.tackles_for_loss__gte}
                                                onChange={(e) =>
                                                    handleChange({ target: { name: 'tackles_for_loss__gte', value: e.target.value } })
                                                }
                                                className="w-full"
                                            />
                                            <input
                                                id="tackles_for_loss-range"
                                                type="range"
                                                min="0"
                                                max="50"
                                                value={filters.tackles_for_loss__lte}
                                                onChange={(e) =>
                                                    handleChange({ target: { name: 'tackles_for_loss__lte', value: e.target.value } })
                                                }
                                                className="w-full"
                                            />
                                            <input
                                                type="number"
                                                name="tackles_for_loss__lte"
                                                value={filters.tackles_for_loss__lte}
                                                onChange={handleChange}
                                                placeholder="Max"
                                                className="p-2 border rounded-md w-20 text-center"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                        <label htmlFor="total_tackles-range" className="block text-sm font-medium text-gray-700 mb-2">
                                            Total Tackles
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="number"
                                                name="total_tackles__gte"
                                                value={filters.total_tackles__gte}
                                                onChange={handleChange}
                                                placeholder="Min"
                                                className="p-2 border rounded-md w-20 text-center"
                                            />
                                            {/* Range Slider */}
                                            <input
                                                id="total_tackles-range"
                                                type="range"
                                                min="0"
                                                max="500"
                                                value={filters.total_tackles__gte}
                                                onChange={(e) =>
                                                    handleChange({ target: { name: 'total_tackles__gte', value: e.target.value } })
                                                }
                                                className="w-full"
                                            />
                                            <input
                                                id="total_tackles-range"
                                                type="range"
                                                min="0"
                                                max="500"
                                                value={filters.total_tackles__lte}
                                                onChange={(e) =>
                                                    handleChange({ target: { name: 'total_tackles__lte', value: e.target.value } })
                                                }
                                                className="w-full"
                                            />
                                            <input
                                                type="number"
                                                name="total_tackles__lte"
                                                value={filters.total_tackles__lte}
                                                onChange={handleChange}
                                                placeholder="Max"
                                                className="p-2 border rounded-md w-20 text-center"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                        <label htmlFor="stuffs-range" className="block text-sm font-medium text-gray-700 mb-2">
                                            Stuffs
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="number"
                                                name="stuffs__gte"
                                                value={filters.stuffs__gte}
                                                onChange={handleChange}
                                                placeholder="Min"
                                                className="p-2 border rounded-md w-20 text-center"
                                            />
                                            {/* Range Slider */}
                                            <input
                                                id="stuffs-range"
                                                type="range"
                                                min="0"
                                                max="25"
                                                value={filters.stuffs__gte}
                                                onChange={(e) =>
                                                    handleChange({ target: { name: 'stuffs__gte', value: e.target.value } })
                                                }
                                                className="w-full"
                                            />
                                            <input
                                                id="stuffs-range"
                                                type="range"
                                                min="0"
                                                max="25"
                                                value={filters.stuffs__lte}
                                                onChange={(e) =>
                                                    handleChange({ target: { name: 'stuffs__lte', value: e.target.value } })
                                                }
                                                className="w-full"
                                            />
                                            <input
                                                type="number"
                                                name="stuffs__lte"
                                                value={filters.stuffs__lte}
                                                onChange={handleChange}
                                                placeholder="Max"
                                                className="p-2 border rounded-md w-20 text-center"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {filters.type === "Player" && (
                                <>
                                    <select
                                        name="team_ID"
                                        value={teamIDMap[filters.team_ID]}
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
                                    <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                        <label htmlFor="height-range" className="block text-sm font-medium text-gray-700 mb-2">
                                            Height (in)
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="number"
                                                name="height_in__gte"
                                                value={filters.height_in__gte}
                                                onChange={handleChange}
                                                placeholder="Min"
                                                className="p-2 border rounded-md w-20 text-center"
                                            />
                                            {/* Range Slider */}
                                            <input
                                                id="height-range"
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={filters.height_in__gte}
                                                onChange={(e) =>
                                                    handleChange({ target: { name: 'height_in__gte', value: e.target.value } })
                                                }
                                                className="w-full"
                                            />
                                            <input
                                                id="height-range"
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={filters.height_in__lte}
                                                onChange={(e) =>
                                                    handleChange({ target: { name: 'height_in__lte', value: e.target.value } })
                                                }
                                                className="w-full"
                                            />
                                            <input
                                                type="number"
                                                name="height_in__lte"
                                                value={filters.height_in__lte}
                                                onChange={handleChange}
                                                placeholder="Max"
                                                className="p-2 border rounded-md w-20 text-center"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                        <label htmlFor="weight-range" className="block text-sm font-medium text-gray-700 mb-2">
                                            Weight (lbs)
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="number"
                                                name="weight__gte"
                                                value={filters.weight__gte}
                                                onChange={handleChange}
                                                placeholder="Min"
                                                className="p-2 border rounded-md w-20 text-center"
                                            />
                                            {/* Range Slider */}
                                            <input
                                                id="weight-range"
                                                type="range"
                                                min="0"
                                                max="400"
                                                value={filters.weight__gte}
                                                onChange={(e) =>
                                                    handleChange({ target: { name: 'weight__gte', value: e.target.value } })
                                                }
                                                className="w-full"
                                            />
                                            <input
                                                id="weight-range"
                                                type="range"
                                                min="0"
                                                max="400"
                                                value={filters.weight__lte}
                                                onChange={(e) =>
                                                    handleChange({ target: { name: 'weight__lte', value: e.target.value } })
                                                }
                                                className="w-full"
                                            />
                                            <input
                                                type="number"
                                                name="weight__lte"
                                                value={filters.weight__lte}
                                                onChange={handleChange}
                                                placeholder="Max"
                                                className="p-2 border rounded-md w-20 text-center"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                        <label htmlFor="starting_Year-range" className="block text-sm font-medium text-gray-700 mb-2">
                                            Starting Year
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="number"
                                                name="starting_Year__gte"
                                                value={filters.starting_Year__gte}
                                                onChange={handleChange}
                                                placeholder="Min"
                                                className="p-2 border rounded-md w-20 text-center"
                                            />
                                            {/* Range Slider */}
                                            <input
                                                id="starting_Year-range"
                                                type="range"
                                                min="2000"
                                                max="2024"
                                                value={filters.starting_Year__gte}
                                                onChange={(e) =>
                                                    handleChange({ target: { name: 'starting_Year__gte', value: e.target.value } })
                                                }
                                                className="w-full"
                                            />
                                            <input
                                                id="starting_Year-range"
                                                type="range"
                                                min="2000"
                                                max="2024"
                                                value={filters.starting_Year__lte}
                                                onChange={(e) =>
                                                    handleChange({ target: { name: 'starting_Year__lte', value: e.target.value } })
                                                }
                                                className="w-full"
                                            />
                                            <input
                                                type="number"
                                                name="starting_Year__lte"
                                                value={filters.starting_Year__lte}
                                                onChange={handleChange}
                                                placeholder="Max"
                                                className="p-2 border rounded-md w-20 text-center"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                        <label htmlFor="age-range" className="block text-sm font-medium text-gray-700 mb-2">
                                            Age
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="number"
                                                name="age__gte"
                                                value={filters.age__gte}
                                                onChange={handleChange}
                                                placeholder="Min"
                                                className="p-2 border rounded-md w-20 text-center"
                                            />
                                            {/* Range Slider */}
                                            <input
                                                id="age-range"
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={filters.age__gte}
                                                onChange={(e) =>
                                                    handleChange({ target: { name: 'age__gte', value: e.target.value } })
                                                }
                                                className="w-full"
                                            />
                                            <input
                                                id="age-range"
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={filters.age__lte}
                                                onChange={(e) =>
                                                    handleChange({ target: { name: 'age__lte', value: e.target.value } })
                                                }
                                                className="w-full"
                                            />
                                            <input
                                                type="number"
                                                name="age__lte"
                                                value={filters.age__lte}
                                                onChange={handleChange}
                                                placeholder="Max"
                                                className="p-2 border rounded-md w-20 text-center"
                                            />
                                        </div>
                                    </div>
                                    {filters.position== "Quarterback" && (
                                        <>
                                            <label>Position-specific Stats</label>
                                            <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                                <label htmlFor="pass_yards-range" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Pass Yards
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="number"
                                                        name="pass_yards__gte"
                                                        value={filters.pass_yards__gte}
                                                        onChange={handleChange}
                                                        placeholder="Min"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                    {/* Range Slider */}
                                                    <input
                                                        id="pass_yards-range"
                                                        type="range"
                                                        min="0"
                                                        max="2000"
                                                        value={filters.pass_yards__gte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'pass_yards__gte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        id="pass_yards-range"
                                                        type="range"
                                                        min="0"
                                                        max="2000"
                                                        value={filters.pass_yards__lte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'pass_yards__lte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="pass_yards__lte"
                                                        value={filters.pass_yards__lte}
                                                        onChange={handleChange}
                                                        placeholder="Max"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                                <label htmlFor="pass_att-range" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Pass Attempts
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="number"
                                                        name="pass_att__gte"
                                                        value={filters.pass_att__gte}
                                                        onChange={handleChange}
                                                        placeholder="Min"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                    {/* Range Slider */}
                                                    <input
                                                        id="pass_att-range"
                                                        type="range"
                                                        min="0"
                                                        max="500"
                                                        value={filters.pass_att__gte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'pass_att__gte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        id="pass_att-range"
                                                        type="range"
                                                        min="0"
                                                        max="500"
                                                        value={filters.pass_att__lte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'pass_att__lte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="pass_att__lte"
                                                        value={filters.pass_att__lte}
                                                        onChange={handleChange}
                                                        placeholder="Max"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                                <label htmlFor="pass_completions-range" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Pass Completions
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="number"
                                                        name="pass_completions__gte"
                                                        value={filters.pass_completions__gte}
                                                        onChange={handleChange}
                                                        placeholder="Min"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                    {/* Range Slider */}
                                                    <input
                                                        id="pass_completions-range"
                                                        type="range"
                                                        min="0"
                                                        max="200"
                                                        value={filters.pass_completions__gte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'pass_completions__gte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        id="pass_completions-range"
                                                        type="range"
                                                        min="0"
                                                        max="200"
                                                        value={filters.pass_completions__lte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'pass_completions__lte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="pass_completions__lte"
                                                        value={filters.pass_completions__lte}
                                                        onChange={handleChange}
                                                        placeholder="Max"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                                <label htmlFor="touchdowns-range" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Touchdowns
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="number"
                                                        name="touchdowns__gte"
                                                        value={filters.touchdowns__gte}
                                                        onChange={handleChange}
                                                        placeholder="Min"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                    {/* Range Slider */}
                                                    <input
                                                        id="touchdowns-range"
                                                        type="range"
                                                        min="0"
                                                        max="10"
                                                        value={filters.touchdowns__gte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'touchdowns__gte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        id="touchdowns-range"
                                                        type="range"
                                                        min="0"
                                                        max="10"
                                                        value={filters.touchdowns__lte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'touchdowns__lte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="touchdowns__lte"
                                                        value={filters.touchdowns__lte}
                                                        onChange={handleChange}
                                                        placeholder="Max"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                                <label htmlFor="interceptions-range" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Interceptions
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="number"
                                                        name="interceptions__gte"
                                                        value={filters.interceptions__gte}
                                                        onChange={handleChange}
                                                        placeholder="Min"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                    {/* Range Slider */}
                                                    <input
                                                        id="interceptions-range"
                                                        type="range"
                                                        min="0"
                                                        max="10"
                                                        value={filters.interceptions__gte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'interceptions__gte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        id="interceptions-range"
                                                        type="range"
                                                        min="0"
                                                        max="10"
                                                        value={filters.interceptions__lte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'interceptions__lte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="interceptions__lte"
                                                        value={filters.interceptions__lte}
                                                        onChange={handleChange}
                                                        placeholder="Max"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                                <label htmlFor="rushing_att-range" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Rushing Attempts
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="number"
                                                        name="rushing_att__gte"
                                                        value={filters.rushing_att__gte}
                                                        onChange={handleChange}
                                                        placeholder="Min"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                    {/* Range Slider */}
                                                    <input
                                                        id="rushing_att-range"
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        value={filters.rushing_att__gte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'rushing_att__gte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        id="rushing_att-range"
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        value={filters.rushing_att__lte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'rushing_att__lte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="rushing_att__lte"
                                                        value={filters.rushing_att__lte}
                                                        onChange={handleChange}
                                                        placeholder="Max"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                                <label htmlFor="rushing_yards-range" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Rushing Yards
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="number"
                                                        name="rushing_yards__gte"
                                                        value={filters.rushing_yards__gte}
                                                        onChange={handleChange}
                                                        placeholder="Min"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                    {/* Range Slider */}
                                                    <input
                                                        id="rushing_yards-range"
                                                        type="range"
                                                        min="0"
                                                        max="500"
                                                        value={filters.rushing_yards__gte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'rushing_yards__gte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        id="rushing_yards-range"
                                                        type="range"
                                                        min="0"
                                                        max="500"
                                                        value={filters.rushing_yards__lte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'rushing_yards__lte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="rushing_yards__lte"
                                                        value={filters.rushing_yards__lte}
                                                        onChange={handleChange}
                                                        placeholder="Max"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                                <label htmlFor="fumbles-range" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Fumbles
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="number"
                                                        name="fumbles__gte"
                                                        value={filters.fumbles__gte}
                                                        onChange={handleChange}
                                                        placeholder="Min"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                    {/* Range Slider */}
                                                    <input
                                                        id="fumbles-range"
                                                        type="range"
                                                        min="0"
                                                        max="10"
                                                        value={filters.fumbles__gte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'fumbles__gte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        id="fumbles-range"
                                                        type="range"
                                                        min="0"
                                                        max="10"
                                                        value={filters.fumbles__lte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'fumbles__lte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="fumbles__lte"
                                                        value={filters.fumbles__lte}
                                                        onChange={handleChange}
                                                        placeholder="Max"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                                <label htmlFor="times_sacked-range" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Times Sacked
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="number"
                                                        name="times_sacked__gte"
                                                        value={filters.times_sacked__gte}
                                                        onChange={handleChange}
                                                        placeholder="Min"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                    {/* Range Slider */}
                                                    <input
                                                        id="times_sacked-range"
                                                        type="range"
                                                        min="0"
                                                        max="50"
                                                        value={filters.times_sacked__gte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'times_sacked__gte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        id="times_sacked-range"
                                                        type="range"
                                                        min="0"
                                                        max="50"
                                                        value={filters.times_sacked__lte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'times_sacked__lte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="times_sacked__lte"
                                                        value={filters.times_sacked__lte}
                                                        onChange={handleChange}
                                                        placeholder="Max"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {filters.position=="WideReceiver" && (
                                        <>
                                            <label>Position-specific Stats</label>
                                            <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                                <label htmlFor="target-range" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Target
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="number"
                                                        name="target__gte"
                                                        value={filters.target__gte}
                                                        onChange={handleChange}
                                                        placeholder="Min"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                    {/* Range Slider */}
                                                    <input
                                                        id="target-range"
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        value={filters.target__gte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'target__gte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        id="target-range"
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        value={filters.target__lte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'target__lte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="target__lte"
                                                        value={filters.target__lte}
                                                        onChange={handleChange}
                                                        placeholder="Max"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                                <label htmlFor="receptions-range" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Receptions
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="number"
                                                        name="receptions__gte"
                                                        value={filters.receptions__gte}
                                                        onChange={handleChange}
                                                        placeholder="Min"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                    {/* Range Slider */}
                                                    <input
                                                        id="receptions-range"
                                                        type="range"
                                                        min="0"
                                                        max="50"
                                                        value={filters.receptions__gte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'receptions__gte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        id="receptions-range"
                                                        type="range"
                                                        min="0"
                                                        max="50"
                                                        value={filters.receptions__lte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'receptions__lte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="receptions__lte"
                                                        value={filters.receptions__lte}
                                                        onChange={handleChange}
                                                        placeholder="Max"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                                <label htmlFor="yards-range" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Yards
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="number"
                                                        name="yards__gte"
                                                        value={filters.yards__gte}
                                                        onChange={handleChange}
                                                        placeholder="Min"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                    {/* Range Slider */}
                                                    <input
                                                        id="yards-range"
                                                        type="range"
                                                        min="0"
                                                        max="600"
                                                        value={filters.yards__gte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'yards__gte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        id="yards-range"
                                                        type="range"
                                                        min="0"
                                                        max="600"
                                                        value={filters.yards__lte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'yards__lte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="yards__lte"
                                                        value={filters.yards__lte}
                                                        onChange={handleChange}
                                                        placeholder="Max"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                                <label htmlFor="touchdowns-range" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Touchdowns
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="number"
                                                        name="touchdowns__gte"
                                                        value={filters.touchdowns__gte}
                                                        onChange={handleChange}
                                                        placeholder="Min"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                    {/* Range Slider */}
                                                    <input
                                                        id="touchdowns-range"
                                                        type="range"
                                                        min="0"
                                                        max="10"
                                                        value={filters.touchdowns__gte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'touchdowns__gte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        id="touchdowns-range"
                                                        type="range"
                                                        min="0"
                                                        max="10"
                                                        value={filters.touchdowns__lte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'touchdowns__lte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="touchdowns__lte"
                                                        value={filters.touchdowns__lte}
                                                        onChange={handleChange}
                                                        placeholder="Max"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                                <label htmlFor="fumble-range" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Fumble
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="number"
                                                        name="fumble__gte"
                                                        value={filters.fumble__gte}
                                                        onChange={handleChange}
                                                        placeholder="Min"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                    {/* Range Slider */}
                                                    <input
                                                        id="fumble-range"
                                                        type="range"
                                                        min="0"
                                                        max="10"
                                                        value={filters.fumble__gte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'fumble__gte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        id="fumble-range"
                                                        type="range"
                                                        min="0"
                                                        max="10"
                                                        value={filters.fumble__lte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'fumble__lte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="fumble__lte"
                                                        value={filters.fumble__lte}
                                                        onChange={handleChange}
                                                        placeholder="Max"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                                <label htmlFor="kick_return-range" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Kick return
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="number"
                                                        name="kick_return__gte"
                                                        value={filters.kick_return__gte}
                                                        onChange={handleChange}
                                                        placeholder="Min"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                    {/* Range Slider */}
                                                    <input
                                                        id="kick_return-range"
                                                        type="range"
                                                        min="0"
                                                        max="10"
                                                        value={filters.kick_return__gte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'kick_return__gte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        id="kick_return-range"
                                                        type="range"
                                                        min="0"
                                                        max="10"
                                                        value={filters.kick_return__lte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'kick_return__lte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="kick_return__lte"
                                                        value={filters.kick_return__lte}
                                                        onChange={handleChange}
                                                        placeholder="Max"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                                <label htmlFor="drops-range" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Drops
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="number"
                                                        name="drops__gte"
                                                        value={filters.drops__gte}
                                                        onChange={handleChange}
                                                        placeholder="Min"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                    {/* Range Slider */}
                                                    <input
                                                        id="drops-range"
                                                        type="range"
                                                        min="0"
                                                        max="5"
                                                        value={filters.drops__gte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'drops__gte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        id="drops-range"
                                                        type="range"
                                                        min="0"
                                                        max="5"
                                                        value={filters.drops__lte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'drops__lte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="drops__lte"
                                                        value={filters.drops__lte}
                                                        onChange={handleChange}
                                                        placeholder="Max"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {filters.position=="RunningBack" && (
                                        <>
                                            <label>Position-specific Stats</label>
                                            <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                                <label htmlFor="rush_att-range" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Rush Attempts
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="number"
                                                        name="rush_att__gte"
                                                        value={filters.rush_att__gte}
                                                        onChange={handleChange}
                                                        placeholder="Min"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                    {/* Range Slider */}
                                                    <input
                                                        id="rush_att-range"
                                                        type="range"
                                                        min="0"
                                                        max="150"
                                                        value={filters.rush_att__gte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'rush_att__gte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        id="rush_att-range"
                                                        type="range"
                                                        min="0"
                                                        max="150"
                                                        value={filters.rush_att__lte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'rush_att__lte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="rush_att__lte"
                                                        value={filters.rush_att__lte}
                                                        onChange={handleChange}
                                                        placeholder="Max"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                                <label htmlFor="rushing_yards-range" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Rushing Yards
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="number"
                                                        name="rushing_yards__gte"
                                                        value={filters.rushing_yards__gte}
                                                        onChange={handleChange}
                                                        placeholder="Min"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                    {/* Range Slider */}
                                                    <input
                                                        id="rushing_yards-range"
                                                        type="range"
                                                        min="0"
                                                        max="1000"
                                                        value={filters.rushing_yards__gte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'rushing_yards__gte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        id="rushing_yards-range"
                                                        type="range"
                                                        min="0"
                                                        max="1000"
                                                        value={filters.rushing_yards__lte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'rushing_yards__lte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="rushing_yards__lte"
                                                        value={filters.rushing_yards__lte}
                                                        onChange={handleChange}
                                                        placeholder="Max"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                                <label htmlFor="rush_touchdown-range" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Rush Touchdowns
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="number"
                                                        name="rush_touchdown__gte"
                                                        value={filters.rush_touchdown__gte}
                                                        onChange={handleChange}
                                                        placeholder="Min"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                    {/* Range Slider */}
                                                    <input
                                                        id="rush_touchdown-range"
                                                        type="range"
                                                        min="0"
                                                        max="10"
                                                        value={filters.rush_touchdown__gte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'rush_touchdown__gte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        id="rush_touchdown-range"
                                                        type="range"
                                                        min="0"
                                                        max="10"
                                                        value={filters.rush_touchdown__lte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'rush_touchdown__lte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="rush_touchdown__lte"
                                                        value={filters.rush_touchdown__lte}
                                                        onChange={handleChange}
                                                        placeholder="Max"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                                <label htmlFor="rec_target-range" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Rec Target
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="number"
                                                        name="rec_target__gte"
                                                        value={filters.rec_target__gte}
                                                        onChange={handleChange}
                                                        placeholder="Min"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                    {/* Range Slider */}
                                                    <input
                                                        id="rec_target-range"
                                                        type="range"
                                                        min="0"
                                                        max="50"
                                                        value={filters.rec_target__gte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'rec_target__gte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        id="rec_target-range"
                                                        type="range"
                                                        min="0"
                                                        max="50"
                                                        value={filters.rec_target__lte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'rec_target__lte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="rec_target__lte"
                                                        value={filters.rec_target__lte}
                                                        onChange={handleChange}
                                                        placeholder="Max"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                                <label htmlFor="rec_yards-range" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Rec Yards
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="number"
                                                        name="rec_yards__gte"
                                                        value={filters.rec_yards__gte}
                                                        onChange={handleChange}
                                                        placeholder="Min"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                    {/* Range Slider */}
                                                    <input
                                                        id="rec_yards-range"
                                                        type="range"
                                                        min="0"
                                                        max="300"
                                                        value={filters.rec_yards__gte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'rec_yards__gte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        id="rec_yards-range"
                                                        type="range"
                                                        min="0"
                                                        max="300"
                                                        value={filters.rec_yards__lte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'rec_yards__lte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="rec_yards__lte"
                                                        value={filters.rec_yards__lte}
                                                        onChange={handleChange}
                                                        placeholder="Max"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                                <label htmlFor="rec_touchdowns-range" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Rec Touchdowns
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="number"
                                                        name="rec_touchdowns__gte"
                                                        value={filters.rec_touchdowns__gte}
                                                        onChange={handleChange}
                                                        placeholder="Min"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                    {/* Range Slider */}
                                                    <input
                                                        id="rec_touchdowns-range"
                                                        type="range"
                                                        min="0"
                                                        max="5"
                                                        value={filters.rec_touchdowns__gte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'rec_touchdowns__gte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        id="rec_touchdowns-range"
                                                        type="range"
                                                        min="0"
                                                        max="5"
                                                        value={filters.rec_touchdowns__lte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'rec_touchdowns__lte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="rec_touchdowns__lte"
                                                        value={filters.rec_touchdowns__lte}
                                                        onChange={handleChange}
                                                        placeholder="Max"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-md shadow-md w-full max-w-md">
                                                <label htmlFor="fumble-range" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Fumble
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="number"
                                                        name="fumble__gte"
                                                        value={filters.fumble__gte}
                                                        onChange={handleChange}
                                                        placeholder="Min"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                    {/* Range Slider */}
                                                    <input
                                                        id="fumble-range"
                                                        type="range"
                                                        min="0"
                                                        max="5"
                                                        value={filters.fumble__gte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'fumble__gte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        id="fumble-range"
                                                        type="range"
                                                        min="0"
                                                        max="5"
                                                        value={filters.fumble__lte}
                                                        onChange={(e) =>
                                                            handleChange({ target: { name: 'fumble__lte', value: e.target.value } })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="fumble__lte"
                                                        value={filters.fumble__lte}
                                                        onChange={handleChange}
                                                        placeholder="Max"
                                                        className="p-2 border rounded-md w-20 text-center"
                                                    />
                                                </div>
                                            </div>

                                        </>
                                    )}
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
                                        placeholder="Team Name (Required)"
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    />
                                    <input
                                        type="text"
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
                                    <div className="p-3 rounded-md shadow-md w-full max-w-md flex items-center">
                                        <span className="text-gray-400 text mr-3">Team Color</span>
                                        <input
                                            id="team_color"
                                            type="color"
                                            name="team_color"
                                            value={insertTeamVals.team_color}
                                            onChange={handleInsertChange}
                                            //className="w-5 h-5 p-0 border-none outline-none rounded-md"
                                        />
                                    </div>
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
                                        placeholder="First Name (Required)"
                                        className="p-3 rounded-md shadow-md w-full max-w-md"
                                    />
                                    <input
                                        type="text"
                                        name="l_Name"
                                        value={insertPlayerVals.l_Name}
                                        onChange={handleInsertChange}
                                        placeholder="Last Name (Required)"
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
                            <button onClick={handleInsert} className="px-4 py-2 bg-green-600 text-white rounded-md">
                                Insert
                            </button>
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
                                    <strong>Team:</strong> {teamIDMap[result.team_ID]}
                                </p>
                                <p>
                                    <strong>Age:</strong> {result.age}
                                </p>
                            </>
                        ) : null}
                    </div>
                    <button
                        onClick={(handleInsert) => handleResultSelect(result)}
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
