import React, { useState } from 'react';
import axios from 'axios';

export default function HomePage() {
    const [selectedTab, setSelectedTab] = useState('Team');
    const [filters, setFilters] = useState({
        teamName: '',
        division: '',
        position: '',
        revenue__gt: '', // Filter for revenue greater than
        revenue__lt: '', // Filter for revenue less than
    });
    const [searchResults, setSearchResults] = useState([]);

    const nflTeams = [
        'Arizona Cardinals', 'Atlanta Falcons', 'Baltimore Ravens', 'Buffalo Bills', 'Carolina Panthers',
        'Chicago Bears', 'Cincinnati Bengals', 'Cleveland Browns', 'Dallas Cowboys', 'Denver Broncos',
        'Detroit Lions', 'Green Bay Packers', 'Houston Texans', 'Indianapolis Colts', 'Jacksonville Jaguars',
        'Kansas City Chiefs', 'Las Vegas Raiders', 'Los Angeles Chargers', 'Los Angeles Rams', 'Miami Dolphins',
        'Minnesota Vikings', 'New England Patriots', 'New Orleans Saints', 'New York Giants', 'New York Jets',
        'Philadelphia Eagles', 'Pittsburgh Steelers', 'San Francisco 49ers', 'Seattle Seahawks',
        'Tampa Bay Buccaneers', 'Tennessee Titans', 'Washington Commanders'
    ];

    const nflDivisions = [
        'AFC East', 'AFC North', 'AFC South', 'AFC West',
        'NFC East', 'NFC North', 'NFC South', 'NFC West'
    ];

    const playerPositions = [
        'Qb', 'Rb', 'Wr', 'Te', 'Ol', 'Cb', 'S', 'Lb', 'Dl', 'K', 'P'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const handleReset = () => {
        setFilters({
            teamName: '',
            division: '',
            position: '',
            revenue__gt: '',
            revenue__lt: ''
        });
        setSearchResults([]);
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/team', {
                params: filters, // Pass filters directly
            });
            setSearchResults(response.data); // Store the results in state
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
                    onClick={() => setSelectedTab('Team')}
                    className={`px-4 py-2 rounded-full ${
                        selectedTab === 'Team' ? 'bg-red-500 text-white' : 'bg-gray-200'
                    }`}
                >
                    Team
                </button>
                <button
                    onClick={() => setSelectedTab('Player')}
                    className={`px-4 py-2 rounded-full ${
                        selectedTab === 'Player' ? 'bg-red-500 text-white' : 'bg-gray-200'
                    }`}
                >
                    Player
                </button>
                <button
                    onClick={() => setSelectedTab('Advanced Filters')}
                    className={`px-4 py-2 rounded-full ${
                        selectedTab === 'Advanced Filters' ? 'bg-red-500 text-white' : 'bg-gray-200'
                    }`}
                >
                    Advanced Filters
                </button>
            </div>

            <div className="my-4">
                {selectedTab === 'Team' ? (
                    <select
                        name="teamName"
                        value={filters.teamName}
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
                ) : selectedTab === 'Player' ? (
                    <input
                        type="text"
                        name="position"
                        value={filters.position}
                        onChange={handleChange}
                        placeholder="Enter Player Position"
                        className="p-3 rounded-md shadow-md w-full max-w-md"
                    />
                ) : (
                    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mx-auto">
                        <h2 className="text-xl font-semibold mb-4">Advanced Filters</h2>
                        <div className="flex flex-col gap-4">
                            <select
                                name="division"
                                value={filters.division}
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
                                    <strong>Team:</strong> {result.team_name}
                                </p>
                                <p>
                                    <strong>Division:</strong> {result.division}
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
        </main>
    );
}
