import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DisplayData from './DisplayData';

export default function HomePage() {
    // Division mapping utilities remain the same
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
            case 1:
                return 'NFC North';
            case 2:
                return 'NFC South';
            case 3:
                return 'NFC East';
            case 4:
                return 'NFC West';
            case 5:
                return 'AFC North';
            case 6:
                return 'AFC South';
            case 7:
                return 'AFC East';
            case 8:
                return 'AFC West';
            default:
                return '';
        }
    };

    const getDivisionID = (divisionName) => {
        return divisionMap[divisionName] || '';
    };

    const [selectedTab, setSelectedTab] = useState('Team');
    const [filters, setFilters] = useState({
        type: 'Team',
        team_Name: '',
        name: '',
        divisionID: '',
        position: '',
        revenue__gt: '',
        revenue__lt: '',
    });
    const [searchResults, setSearchResults] = useState([]);
    const [nflTeams, setNflTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    const playerPositions = [
        'QuarterBack', 'RunningBack', 'WideReceiver', 'Defense'
    ];

    const queryTypes = [
        'Team', 'Player'
    ];

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
        
        // Clear appropriate filters based on which tab is selected
        if (tab === 'Team') {
            setFilters(prev => ({
                ...prev,
                type: 'Team',
                name: '',              // Clear player name
                divisionID: '',        // Clear advanced filters
                revenue__gt: '',
                revenue__lt: ''
            }));
        } else if (tab === 'Player') {
            setFilters(prev => ({
                ...prev,
                type: 'Player',
                team_Name: '',         // Clear team selection
                divisionID: '',        // Clear advanced filters
                revenue__gt: '',
                revenue__lt: ''
            }));
        } else if (tab === 'Advanced Filters') {
            setFilters(prev => ({
                ...prev,
                team_Name: '',         // Clear team selection
                name: '',              // Clear player name
            }));
        }
        
        // Clear search results when switching tabs
        setSearchResults([]);
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

    const handleReset = () => {
        setFilters({
            type: 'Team',
            team_Name: '',
            name: '',
            divisionID: '',
            position: '',
            revenue__gt: '',
            revenue__lt: ''
        });
        setSelectedTab('Team')
        setSearchResults([]);
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api', {
                params: filters,
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
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
                ) : (
                    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mx-auto">
                        <h2 className="text-xl font-semibold mb-4">Advanced Filters</h2>
                        <div className="flex flex-col gap-4">
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
                                name="revenue__gt"
                                value={filters.revenue__gt}
                                onChange={handleChange}
                                placeholder="Minimum Revenue"
                                className="p-3 rounded-md shadow-md w-full max-w-md"
                            />
                            <input
                                type="number"
                                name="revenue__lt"
                                value={filters.revenue__lt}
                                onChange={handleChange}
                                placeholder="Maximum Revenue"
                                className="p-3 rounded-md shadow-md w-full max-w-md"
                            />
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
                            <li key={index} className="p-4 border-b border-gray-300">
                                <p>
                                    <strong>Team:</strong> {result.team_Name}
                                </p>
                                <p>
                                    <strong>Division:</strong> {getDivisionName(result.divisionID)}
                                </p>
                                <p>
                                    <strong>Revenue:</strong> ${result.revenue}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-4 text-gray-500">No results found</p>
                )}
            </div>
            {searchResults.length > 0 && <DisplayData data={searchResults} />}
        </main>
    );
}