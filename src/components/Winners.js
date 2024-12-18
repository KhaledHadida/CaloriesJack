import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { rematch } from "../api/gameApi";
import { leaveGame } from "../api/gameApi";
import { supabase } from "../api/supabaseClient";
import { useGameContext } from "./GameContext";


function Winners({ players, winner, currentPlayer, caloriesGoal, gameId, setGameData, amILeader, subscription, token }) {
    const { playSound } = useGameContext();
    //Only to persist players because if I dont then any changes from DB is caught and is reflected here 
    const playersRef = useRef(players);
    //This is so we can go to next component (GameLobby)
    const navigate = useNavigate();
    //Winner
    const [winnerPlayers, setWinnerPlayers] = useState([]);

    //In case we get multiple winners
    const [highestScoreSoFar, setHighestScoreSoFar] = useState(0);

    //Toggle show / hide winners ui
    const [toggleResults, setToggleResults] = useState(true);

    // lookup object to map player_id to player name
    const playerLookup = playersRef.current.reduce((acc, player) => {
        acc[player.player_id] = player.name;
        return acc;
    }, {});

    //Player leaves game
    const handleLeave = async (subscription) => {
        console.log("reset");
        try {
            // Remove Supabase subscription (not the best solution but works)
            supabase.removeChannel(subscription);
            playSound('Back');
            await leaveGame(currentPlayer, gameId);
        } catch (error) {

        }
        //Go home anyway - error or not.
        navigate('/', { replace: true });
    };

    //Player leaves game
    const handleRematch = async () => {
        try {
            await rematch(gameId, token).then((res) => {
                setGameData((oldData) => ({
                    ...oldData,
                    gameStatus: res.gameSession.game_status,
                    foodItems: res.gameSession.food_items,
                    selectedItems: res.gameSession.selected_items,
                    winner: res.gameSession.winner,
                    rematchCount: res.gameSession.rematch_counter
                }));
                playSound('Click');
                //Put the player into lobby  
                navigate('/lobby');
            });

            console.log("Successfully restarted game!");

        } catch (error) {
            console.log(error.message);

        }
    };

    //Sort the players (& insert the goal)
    winner['Threshold'] = caloriesGoal;
    const sortedPlayers = Object.entries(winner).sort((a, b) => b[1] - a[1]); //descending order

    //Logic to determine if user won or lost.
    useEffect(() => {
        //Play sound when this appears
        playSound('Won');

        let highestScore = 0;
        let potentialWinners = [];

        for (const [id, score] of sortedPlayers) {
            if (score < caloriesGoal) {
                if (score > highestScore) {
                    // Found a new highest score below the caloriesGoal
                    highestScore = score;
                    potentialWinners = [id]; // Start fresh with the new highest scorer
                } else if (score === highestScore) {
                    // There's a tie
                    potentialWinners.push(id);
                }
            }
        }

        // Set the highest score and winner players list
        //setHighestScoreSoFar(highestScore);
        setWinnerPlayers(potentialWinners);
    }, []);


    return (
        <div className={`fixed inset-0 flex items-center justify-center ${toggleResults ? `bg-black bg-opacity-90 lg:bg-opacity-50` : ``} z-50 `}>
            <div className={`dark:bg-dark-gray bg-white rounded-lg p-8 shadow-lg w-full max-w-md text-center lg:scale-100 scale-70 ${toggleResults ? `` : `hidden`}`}>
                <h2 className=" font-semibold mb-4">Results</h2>
                {/* Table */}
                <div className="relative overflow-x-auto">
                    <table className="w-full text-center rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Player
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Score
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPlayers.map(([id, score]) => (
                                <tr
                                    key={id}
                                    className={`${playerLookup[id] === currentPlayer.name ? 'bg-light-gray text-white font-medium' : ''} border-b dark:bg-gray-800 dark:border-gray-700`}
                                >
                                    {id === 'Threshold' ? (
                                        <th colSpan={2} className="px-6 py-2 bg-red-500 text-white text-center font-semibold border border-gray-400">
                                            {caloriesGoal} Calories Limit
                                        </th>
                                    ) : (
                                        <>
                                            <th scope="row" className="px-6 py-4 whitespace-nowrap dark:text-white">
                                                {playerLookup[id] || "Unknown"}
                                            </th>
                                            <td className="px-6 py-4">
                                                {score}
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-5">
                    {winnerPlayers.includes(currentPlayer.player_id) ? <h2>You won!</h2> : <h2>You lost.</h2>}
                </div>
                {amILeader ? (<button
                    onClick={handleRematch}
                    className="dark:bg-light-gray bg-green-500 hover:bg-green-700 text-white py-2 px-4 mr-5 rounded focus:outline-none focus:shadow-outline transform transition-transform duration-200 hover:scale-110"
                >
                    Rematch?
                </button>) : (<></>)}
                <button
                    onClick={() => { handleLeave(subscription) }}
                    className="dark:bg-medium-gray px-4 py-2 mt-5  bg-light-orange text-white rounded hover:bg-dark-orange transform transition-transform duration-200 hover:scale-110"
                >
                    Leave
                </button>
            </div>
            <button
                onPointerUp={() => setToggleResults((prev) => !prev)}
                className="dark:bg-light-gray fixed z-51 bottom-[1%] left-[1%] px-8 py-4 bg-light-orange text-white rounded hover:bg-dark-orange transform transition-transform duration-200 hover:scale-110"
            >
                {toggleResults ? 'Hide' : 'Show'}
            </button>
        </div>
    );
}

export default Winners;
