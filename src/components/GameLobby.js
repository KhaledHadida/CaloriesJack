import { useEffect, useState } from "react";
import { useGameContext } from "./GameContext";
import { useNavigate } from 'react-router-dom';
import { leaveGame, startGame } from "../api/gameApi";
import { supabase } from "../api/supabaseClient";
import { FaCrown } from "react-icons/fa";
import LoadingDots from "./LoadingDots";

function GameLobby() {
    const { gameData, setGameData } = useGameContext();

    //This is so we can go to next component (GameLobby)
    const navigate = useNavigate();

    //error
    const [response, setResponse] = useState("");
    //list of players
    const [players, setPlayers] = useState(gameData.players || []);

    //Leader stored
    const [leader, setLeader] = useState(gameData.players[0].player_id);

    //Toggle when leader leaves
    const [leaderLeft, setLeaderLeft] = useState(false);



    // //Images to pass to Game.js
    // const [images, setImages] = useState([]);

    // //IMPORT the images - this is to prevent importing all images (it'd slow the game down)
    // const loadImage = async (imageName) => {
    //     try {
    //         const image = await import(`../assets/images/${imageName}`);
    //         return image.default;
    //     } catch (error) {
    //         console.error(`Image not found: ${imageName}`, error);
    //         return imageName;
    //     }
    // };

    //This is to LOAD in the images
    const loadImages = async () => {
        const loadedImages = await Promise.all(

            //imageNames.map((name) => loadImage(name));

            //NEW
            gameData.foodItems.map(async (item) => {
                const imageName = item.name;
                try {
                    const image = await import(`../assets/images/${imageName}.png`);
                    return { [`${imageName}.png`]: image.default };
                } catch (error) {
                    console.log("Image not found " + imageName);
                    return { [`${imageName}.png`]: null };
                }
            })
        );
        //setImages(loadedImages);

        //Put them into an object filled with all images - thats what reducer does
        // const imageMap = loadedImages.reduce((acc, img, index) => {
        //     if (img) {
        //         acc[imageNames[index]] = img;
        //     }
        //     return acc;
        // }, {});

        // Reduce the array of objects into a single object (dictionary)
        const imageDictionary = loadedImages.reduce((acc, curr) => {
            return { ...acc, ...curr };
        }, {});

        //Update useContext with images
        setGameData((prevData) => ({
            ...prevData,
            images: imageDictionary
        }));
    };


    //LOAD THE IMAGES FOR GAME
    useEffect(() => {
        //console.log(gameData);
        loadImages();

    }, []);

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
                    const updatedPlayers = payload.new.players || [];
                    const gamePhaseChange = payload.new.game_status;

                    //set players whenever a new one joins basically
                    setPlayers(updatedPlayers);

                    //Check if leader left. first store leader (first player is always leader)

                    if (leader != updatedPlayers[0]?.player_id) {
                        //set the leader
                        setLeaderLeft(true);
                    }



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
        <div>
            {leaderLeft && (<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md text-center text-4xl">
                    <h1>Game host has left the game.</h1>
                    <h1>Game is abandoned. :( </h1>
                    <button onClick={() => { handleLeave() }} className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 mt-5 rounded focus:outline-none focus:shadow-outline transform transition-transform duration-200 hover:scale-110 shadow-xl">
                        Leave
                    </button>
                </div>
            </div>)}
            <div className="text-3xl h-full flex flex-col">
                <h1 className="text-8xl text-center">Game Lobby</h1>

                <div className="flex flex-col items-center justify-center flex-grow gap-y-7">
                    <div className="bg-light-orange shadow-md rounded px-8 pt-6 pb-8 text-center">
                        <h1 className="text-5xl">Game ID:</h1>
                        <h1 className="mb-11 text-5xl">{gameData.gameId}</h1>
                        <h1>Game Rules:</h1>
                        <h1 className="">Calories (per 100g): {gameData.caloriesGoal}</h1>
                        <h1 className="">Timer: {gameData.timer}</h1>
                    </div>
                    {/* Right side - which will have the tab of players who are joining as a table */}
                    <div className="bg-light-orange shadow-md rounded px-8 pt-6 pb-8 text-center">

                        <h1 className="underline">Players List:</h1>
                        <ul>
                            {players.map((player, index) => (
                                <li key={index}>
                                    <div className={`${gameData.currentPlayer.name == player.name ? "font-bold" : ''} flex justify-center gap-x-3`}>
                                        {index == 0 ? (
                                            <div>
                                                <FaCrown />
                                            </div>
                                        ) : (<></>)}
                                        {player.name}
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <p className="my-5 text-red-500">{response}</p>
                        {/* only a leader can start a game */}
                        {gameData.leader ? (<button onClick={() => { handleStart() }} className="bg-green-500 hover:bg-green-700 text-white  py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-5 transform transition-transform duration-200 hover:scale-110 shadow-xl">
                            Start
                        </button>) :
                            (<div><p className="italic text-lg my-5">
                                <LoadingDots text={"Waiting on game host to start game"} />
                            </p></div>)}

                        <button onClick={() => { handleLeave() }} className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition-transform duration-200 hover:scale-110 shadow-xl">
                            Leave
                        </button>
                    </div>
                </div>
            </div>

        </div>

    );
}

export default GameLobby;
