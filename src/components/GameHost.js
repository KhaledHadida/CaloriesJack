import { createGame } from "../api/gameApi";
import { useEffect, useState } from "react";
import { IoRefreshCircle } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useGameContext } from "./GameContext";
import BackButton from "./BackButton";

function GameHost() {
    //Global access of game properties
    const { setGameData } = useGameContext();

    //This is so we can go to next component (GameLobby)
    const navigate = useNavigate();
    //Fields:

    //ID for game session
    const [gameId, setGameId] = useState(1234);

    //Name
    const [name, setName] = useState("");
    //Handle name
    const handleName = (e) => {
        setName(e.target.value);
    }

    //cold-start message warning
    const [showMsg, setShowMsg] = useState(false);
    const handleColdStartMsg = () => {
        setShowMsg(false);
        setTimeout(() => {
            setShowMsg(true);
        }, 5000);
    }


    //calories
    const [calories, setCalories] = useState(500);
    //Handle cals
    const handleCalories = (e) => {
        setCalories(e.target.value);
    }

    //timer
    const [timer, setTimer] = useState(60);
    //Handle timer
    const handleTimer = (e) => {
        setTimer(e.target.value);
    }

    //error
    const [response, setResponse] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        //Show the message if there is no response from backend basically
        handleColdStartMsg();
        try {
            if (validateInput) {
                await createGame(name, gameId, calories, timer).then((res) => {
                    //console.log(res);
                    setGameData((oldData) => ({
                        ...oldData,
                        gameId: res.gameSession.game_id,
                        players: res.gameSession.players,
                        //Track who is who (Initially had it for non participating players but also leader needs it)
                        currentPlayer: { "name": name, "player_id": res.leaderID },
                        gameStatus: res.gameSession.game_status,
                        foodItems: res.gameSession.food_items,
                        selectedItems: res.gameSession.selected_items,
                        leader: res.gameSession.leader,
                        caloriesGoal: res.gameSession.calories_goal,
                        timer: res.gameSession.timer,
                        winner: res.gameSession.winner
                    }));

                    //NEW - We no longer will allow Backend to store our cookies (CORS issues persisting)
                    // Save token in a cookie
                    document.cookie = `leaderSession=${res.token}; path=/; max-age=7200; secure; samesite=None`;
                });
                setResponse("Successfully created a game!");
                navigate('/lobby',{ replace: true });
            }
        } catch (error) {
            setResponse(error.message);
            // console.log('Error creating game!!', error.response);
        }
    };

    //Validate all variables
    const validateInput = () => {
        //Validate gameID
        if (gameId > 9999 || gameId < 0) {
            return false;
        }

        //Validate Name
        if (!name || name.length > 10) {
            return false;
        }
        //Validate Calories Goal
        if (calories < 500 || calories > 2500) {
            return false;
        }

        //Validate Timer
        if (timer < 30) {
            return false;
        }
        //All is good
        return true;
    }

    //Refresh gameID by user
    const refreshGameID = () => {
        const newGameID = Math.floor(1000 + Math.random() * 9000);
        setGameId(newGameID);
    }


    useEffect(() => {
        refreshGameID();
    }, []);

    return (
        <div className="text-3xl h-full flex flex-col">
            <BackButton />
            <h1 className="text-6xl md:text-8xl lg:text-center text-right my-5">Host a Game</h1>
            <div className="flex items-center justify-center flex-grow">
                <form className="bg-light-orange dark:bg-dark-gray shadow-md rounded px-8 pt-6 pb-8 mb-4 text-center" onSubmit={handleSubmit}>
                    {/* Left side - which will have the configuration for the main party leader to choose */}
                    <div>
                        <label>
                            Game Session ID:
                        </label>
                        <div className="flex justify-center space-x-12">
                            <p className="mb-11">{gameId}</p>
                            <IoRefreshCircle onClick={() => { refreshGameID() }} className="mt-1 cursor-pointer" />
                        </div>
                        <label>
                            Your Name:
                        </label>
                        <input className="dark:bg-medium-gray dark:placeholder-light-gray dark:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-11"
                            id="name" type="text" placeholder="Enter your name (max. 10 chars)" maxLength="10" value={name} onChange={handleName} required />
                        {/* Calories goal */}
                        <label>
                            Calories Goal:
                        </label>
                        {/* Validation here!!!! a clever player can change the DOM using the HTML so either backend validate or use a function here to validate it */}
                        <input className="dark:bg-medium-gray dark:placeholder-light-gray dark:text-white block shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-11 w-full"
                            id="caloriesGoal" type="number" placeholder="Calories (min. 500 cal, max. 2500 cal)" max="2500" min="500" value={calories} onChange={handleCalories} required />
                        {/* Timer */}
                        <label>
                            Timer:
                        </label>
                        {/* Validation here!!!! a clever player can change the DOM using the HTML so either backend validate or use a function here to validate it */}
                        <input className="dark:bg-medium-gray dark:placeholder-light-gray dark:text-white block shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-11 w-full"
                            id="caloriesGoal" type="number" placeholder="Timer (min 30 secs)" max="9999" min="30" value={timer} onChange={handleTimer} required />
                        <p className="my-5 text-red-500">{response}</p>
                        <button className="dark:bg-medium-gray  bg-green-500 hover:bg-green-700 text-white py-2 w-1/2 rounded focus:outline-none focus:shadow-outline transform transition-transform duration-200 hover:scale-110" type="submit">
                            Create
                        </button>
                        {showMsg && (
                            <p className="italic text-md">Due to cold-starts, expect a delay starting by 50 seconds or more</p>
                        )}
                    </div>
                </form>
                {/* Right side - which will have the tab of players who are joining as a table */}
                {/* <FaArrowRight size={40} className="mx-11" />
                <div className="bg-light-orange shadow-md rounded px-8 pt-6 pb-8 text-center">
                    <h1>Players List:</h1>
                    <ol>
                        <li>
                            Bear
                        </li>
                        <li>
                            Cat
                        </li>
                    </ol>
                </div> */}
            </div>
        </div>

    );
}

export default GameHost;
