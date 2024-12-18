import { useEffect, useRef, useState } from "react";
import { useGameContext } from "./GameContext";
import { useNavigate } from 'react-router-dom';
import { leaveGame, startGame } from "../api/gameApi";
import { supabase } from "../api/supabaseClient";
import { FaCrown } from "react-icons/fa";
import LoadingDots from "./LoadingDots";

//Tips
import { FaGratipay } from "react-icons/fa6";

function GameLobby() {
    const { gameData, setGameData, playSound } = useGameContext();

    //Tips bank (May move later if list grows too big)
    const tips = [
        "As part of strategy, you can press Done early to get 0 calories as a tactic!",
        "As of now, if you are using your phone to play, please play in landscape!",
        "Try to save your one-time skip if all food choices are calorie dense!",
        "Don't be fooled, Nuts can be really calories dense!",
        "Don't forget to eat your veggies!",
        "Please do not use this game as a guideline for your diet!",
        "Play with friends! It's a multiplayer game! At least that's what I intended this game to be :)"
    ]

    const currentTip = useRef(tips[Math.floor(Math.random() * tips.length)]);

    //This is so we can go to next component (GameLobby)
    const navigate = useNavigate();

    //error
    const [response, setResponse] = useState("");
    //list of players
    const [players, setPlayers] = useState(gameData.players || []);

    //Leader stored
    const [leader, setLeader] = useState(gameData.players[0]?.player_id);

    //Toggle when leader leaves
    const [leaderLeft, setLeaderLeft] = useState(false);

    //Timer - quick countdown to start game
    const [time, setTime] = useState(5);
    const [isRunning, setIsRunning] = useState(false);


    //Timer
    const startTimer = (initialTime) => {
        //setTime(initialTime);
        setIsRunning(true);
        handleStart();
    };

    //Timer for when to start game
    useEffect(() => {
        if (isRunning) {
            if (time > 0) {
                const timeoutId = setTimeout(() => {
                    playSound('Clock');
                    setTime((prevTimer) => prevTimer - 1);
                }, 1000);

                return () => { clearTimeout(timeoutId) };
            } else {
                //Start game
                //This puts the player into game screen.
                navigate('/game',{ replace: true });
            }
        }
    }, [time, isRunning]);


    //This is to LOAD in the images
    const loadImages = async () => {
        const loadedImages = await Promise.all(
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
                        //navigate('/game');
                        setIsRunning(true);
                    }

                }
            )
            .subscribe();

        // Add the event listener
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            if (subscription?.state === 'subscribed') {
                supabase.removeChannel(subscription);
            } else {
                //console.warn("No active subscription. User might've tried to access the game without proper setup");
            }
        };
    }, [gameData]);

    //Player leaves game
    const handleLeave = async () => {
        try {
            await leaveGame(gameData.currentPlayer, gameData.gameId);
            playSound('Back');
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
            await startGame(gameData.gameId, gameData.token);
            playSound('Start');

        } catch (error) {
            setResponse(error.message);

        }
    };


    return (
        <div>
            {leaderLeft && (<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="dark:bg-dark-gray bg-white rounded-lg p-8 shadow-lg w-full max-w-md text-center text-4xl">
                    <h1>Game host has left the game.</h1>
                    <h1>Game is abandoned. :( </h1>
                    <button onClick={() => { handleLeave() }} className="dark:bg-medium-gray bg-red-500 hover:bg-red-700 text-white py-2 px-4 mt-5 rounded focus:outline-none focus:shadow-outline transform transition-transform duration-200 hover:scale-110 shadow-xl">
                        Leave
                    </button>
                </div>
            </div>)}
            <div className="text-3xl h-full flex flex-col">
                <h1 className="text-8xl text-center">Game Lobby</h1>

                <div className="flex flex-col items-center justify-center flex-grow gap-y-7 ">
                    <div className="dark:bg-dark-gray bg-light-orange shadow-md rounded px-8 pt-6 pb-8 text-center">
                        <h1 className="text-5xl">Game ID:</h1>
                        <h1 className="mb-11 text-5xl">{gameData.gameId}</h1>
                        <h1>Game Rules:</h1>
                        <h1 className="">Calories (per 100g): {gameData.caloriesGoal}</h1>
                        <h1 className="">Timer: {gameData.timer}</h1>
                    </div>
                    <div className="flex justify-center items-center gap-x-3 mx-5">
                        <FaGratipay size={20} />
                        <div className="text-2xl text-center">
                            <p className="font-bold inline">Tip: </p>
                            {/* random tips! */}
                            <span>{currentTip.current}</span>
                        </div>
                        <FaGratipay size={20} />
                    </div>
                    {/* under - which will have the tab of players who are joining as a table */}
                    <div className="dark:bg-dark-gray bg-light-orange shadow-md rounded px-8 pt-6 pb-8 text-center mb-5">

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
                        <p className="my-5 text-red-500 ">{response}</p>
                        {/* only a leader can start a game */}
                        {gameData.leader ? (
                            isRunning ? (
                                <div>
                                    <p>Game is starting in..</p>
                                    <p>{time}</p>
                                </div>
                            ) : (
                                <div>
                                    <button onClick={() => { startTimer() }} className="dark:bg-light-gray bg-green-500 hover:bg-green-700 text-white  py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-5 transform transition-transform duration-200 hover:scale-110 shadow-xl">
                                        Start
                                    </button>
                                    <button onClick={() => { handleLeave() }} className="dark:bg-medium-gray bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition-transform duration-200 hover:scale-110 shadow-xl">
                                        Leave
                                    </button>
                                </div>
                            )
                        ) :
                            (
                                isRunning ? (
                                    <div>
                                        <p>Game is starting in..</p>
                                        <p>{time}</p>
                                    </div>) : (
                                    <div>
                                        <div className="italic text-lg my-5 w-[250px]">
                                            <LoadingDots text={"Waiting on game host to start game"} />
                                        </div>
                                        <button onClick={() => { handleLeave() }} className="dark:bg-medium-gray bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition-transform duration-200 hover:scale-110 shadow-xl">
                                            Leave
                                        </button>
                                    </div>
                                )

                            )
                        }


                    </div>
                </div>
            </div>



        </div>

    );
}

export default GameLobby;
