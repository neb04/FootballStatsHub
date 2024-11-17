import { useState, useRef, useEffect } from 'react'
import HomePage from './components/HomePage'
import Header from './components/Header'
import { teams, players } from './utils/script';
function App() {
  const [query, setQuery] = useState("") //Initial user input
  const [data, setData] = useState(null);

  useEffect(() => {
    if (query) {
      // Check if the query is a team name or a player name
      const selectedTeam = teams.find(team => team.team_Name === query); {/* searches the teams array to see if there is a team with a team_Name that matches query. */}
      const selectedPlayer = players.find(player => 
        `${player.f_Name} ${player.l_Name}`.toLowerCase() === query.toLowerCase()); {/* searches the players array to see if any player’s full name (first name + last name) matches query. */}

      {/* updating state value */}
      if (selectedTeam) {
        setData({ type: 'team', data: selectedTeam });
      } else if (selectedPlayer) {
        setData({ type: 'player', data: selectedPlayer });
      } else {
        setData(null);
      }
    }
  }, [query]); {/* Use effect re-renders everytime query changes */}

  return (
    <div className='flex flex-col max-w-[1000px] mx-auto w-full'>
      <section className='min-h-screen flex flex-col'>
      <Header />
      <HomePage setQuery={setQuery} />
      
      </section>
      <footer></footer>
    </div>
  )
}

export default App
