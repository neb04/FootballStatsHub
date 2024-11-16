import React, { useState, useEffect, useRef } from 'react'

export default function HomePage(props) {
    const { query, setQuery } = props

    const [selectedTab, setSelectedTab] = useState('Team');
    const [filters, setFilters] = useState({
        teamName: '',
        division: '',
        position: '',
        revenue: ''
    });
    

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
            revenue: ''
        });
    };

    const handleSearch = () => {
        // Implement search functionality based on the selected filters
        console.log("Searching with filters:", filters);
    };

    return (
        <main className='flex-1  p-4 flex flex-col gap-3 text-center sm:gap-4  justify-center pb-20 '>

            <h1 className='font-semibold text-5xl sm:text-6xl md:text-7xl'>Football<span className='text-red-600 bold'> Stats</span><span className='font-bold text-5xl sm:text-6xl md:text-7xl'> Hub</span></h1>

            {/* &rarr html element for arrow*/}
            <h3 className='font-medium md:text-lg'>Search <span className='text-red-600'>&rarr;</span> Analyze <span className='text-red-600'>&rarr;</span> Repeat</h3>

            <div className="flex items-center justify-center gap-2 mt-4">
                <button onClick={() => setSelectedTab('Team')} className={`px-4 py-2 rounded-full ${selectedTab === 'Team' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>
                    Team
                </button>
                <button onClick={() => setSelectedTab('Player')} className={`px-4 py-2 rounded-full ${selectedTab === 'Player' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>
                    Player
                </button>
                <button onClick={() => setSelectedTab('Advanced Filters')} className={`px-4 py-2 rounded-full ${selectedTab === 'Advanced Filters' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>
                    Advanced Filters
                </button>
            </div>

            <div className="flex items-center w-full max-w-md p-2 text-base justify-between gap-4 mx-auto w-72 max-w-full my-4">
                {selectedTab === 'Team' ? (
                    <select 
                        value={query} 
                        onChange={(e) => setQuery(e.target.value)} 
                        className="flex-grow p-3 text-gray-700 bg-transparent outline-none rounded-full bg-white shadow-md px-4 py-4"
                    >
                        <option value="">Select a Team</option>
                        {nflTeams.map((team, index) => (
                            <option key={index} value={team}>{team}</option>
                        ))}
                    </select>
                ) : selectedTab === 'Player' ? (
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter Player Name"
                        className="flex-grow p-3 text-gray-700 bg-transparent outline-none rounded-full bg-white shadow-md px-4 py-4"
                    />
                ) : (
                    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mx-auto">
                        <h2 className="text-xl font-semibold mb-4">Advanced Filters</h2>
                        <div className="flex flex-col gap-4">
                            {/* Team Name Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                                <select 
                                    name="teamName" 
                                    value={filters.teamName} 
                                    onChange={handleChange} 
                                    className="w-full border border-gray-300 rounded-md p-2"
                                >
                                    <option value="">Select a Team</option>
                                    {nflTeams.map((team, index) => (
                                        <option key={index} value={team}>{team}</option>
                                    ))}
                            </select>
                        </div>

                        {/* NFL Divisions Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">NFL Division</label>
                            <select 
                                name="division" 
                                value={filters.division} 
                                onChange={handleChange} 
                                className="w-full border border-gray-300 rounded-md p-2"
                            >
                                <option value="">Select a Division</option>
                                {nflDivisions.map((division, index) => (
                                    <option key={index} value={division}>{division}</option>
                                ))}
                            </select>
                        </div>

                        {/* Player Position Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Player Position</label>
                            <select 
                                name="position" 
                                value={filters.position} 
                                onChange={handleChange} 
                                className="w-full border border-gray-300 rounded-md p-2"
                            >
                                <option value="">Select a Position</option>
                                {playerPositions.map((position, index) => (
                                    <option key={index} value={position}>{position}</option>
                                ))}
                            </select>
                        </div>

                        {/* Revenue Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Revenue</label>
                            <input 
                                type="number" 
                                name="revenue" 
                                value={filters.revenue} 
                                onChange={handleChange} 
                                placeholder="Enter revenue amount" 
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-between mt-4">
                            <button onClick={handleReset} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md">
                                Reset
                            </button>

                            <button onClick={handleSearch} className="px-4 py-2 bg-blue-600 text-white rounded-md">
                                Search
                            </button>
                        </div>
                    </div>
                </div>
                )}
                
            </div>

            <p className='text-base'>Find information about <span className='text-red-600 bold'> ANY</span> NFL Team</p>

            <p className='italic text-slate-400'>Free now free forever</p>
        </main>
    )
}
