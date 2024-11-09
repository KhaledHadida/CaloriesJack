import { useEffect, useState } from "react";
import { useGameContext } from "./GameContext";
import { useNavigate } from 'react-router-dom';
import { leaveGame, startGame } from "../api/gameApi";
import { supabase } from "../api/supabaseClient";


function GameLobby() {
    const { gameData } = useGameContext();

    //This is so we can go to next component (GameLobby)
    const navigate = useNavigate();

    //error
    const [response, setResponse] = useState("");
    //list of players
    const [players, setPlayers] = useState(gameData.players || []);



    useEffect(() => {
        //redirect player if they are in wrong place (i.e they're trying to get to lobby!)
        if (gameData.players.length == 0) navigate('/');
        //console.log(gameData);

        // Function to handle player accidentally refreshing page or exiting the tab.
        const handleBeforeUnload = (e) => {
            //Only ask if there is gameData (data that can be lost)
            if (players.length > 0) {
                e.preventDefault();
                e.returnValue = '';
            }
            //make sure they free space 
            //Ok this may have to be moved somewhere else.
            handleLeave();
        };

        //Subscribe to see changes
        const subscription = supabase
            .channel('public:game_sessions')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'game_sessions', filter: `game_id=eq.${gameData.gameId}` },
                (payload) => {
                    //console.log("Received update:", payload);
                    const updatedPlayers = payload.new.players;
                    const gamePhaseChange = payload.new.game_status
                    //set players whenever a new one joins basically
                    setPlayers(updatedPlayers);

                    //Check if game is started so that the players can move on to next game screen
                    if (gamePhaseChange === 'STARTED') {
                        //Move on to game!
                        navigate('/game');
                    }
                }
            )
            .subscribe();

        // Add the event listener
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Clean up the event listener on component unmount
        return () => {
            console.log("Unsubbed");
            window.removeEventListener('beforeunload', handleBeforeUnload);
            supabase.removeChannel(subscription);
        };
    }, [gameData]);



    //Player leaves game
    const handleLeave = async () => {
        try {
            await leaveGame(gameData.currentPlayer, gameData.gameId);
            setResponse("Leaving the game..");
        } catch (error) {
            setResponse("An error has occurred.");
        }
        //Go home anyway - error or not.
        navigate('/');
    };

    //leader starting game
    const handleStart = async () => {
        try {
            await startGame(gameData.gameId);
            setResponse("Successfully started the game!");
            //Go play the game!
            // navigate('/game');

        } catch (error) {
            setResponse(error.message);

        }
    };


    return (
        <div className="text-3xl h-screen flex flex-col">
            <h1 className="text-8xl text-center">Game Lobby</h1>
            <div className="flex items-center justify-center flex-grow">
                {/* Right side - which will have the tab of players who are joining as a table */}
                <div className="bg-light-orange shadow-md rounded px-8 pt-6 pb-8 text-center">
                    <h1 className="mb font-bold">Game ID: {gameData.gameId}</h1>
                    <h1 className="mb font-semibold">Calories: {gameData.caloriesGoal}</h1>
                    <h1 className="mb-5 font-semibold">Timer: {gameData.timer}</h1>
                    <h1>Players List:</h1>
                    <ul>
                        {players.map((player, index) => (
                            <li key={index}>
                                <div className={`${gameData.currentPlayer.name == player.name ? "font-bold" : ''}`}>
                                    {player.name}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <p className="my-5 text-red-500">{response}</p>
                    {/* only a leader can start a game */}
                    {gameData.leader ? (<button onClick={() => { handleStart() }} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Start
                    </button>) :
                        (<div><p className="italic text-lg my-5">Waiting on game host to start game..</p></div>)}

                    <button onClick={() => { handleLeave() }} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Leave
                    </button>
                </div>
            </div>
        </div>

    );
}

export default GameLobby;
