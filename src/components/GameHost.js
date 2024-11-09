import { createGame } from "../api/gameApi";
import { useEffect, useState } from "react";
import { IoRefreshCircle } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useGameContext } from "./GameContext";

function GameHost() {
    //Global access of game properties
    const {setGameData} = useGameContext();

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

    //List of players who joined (Leader first of course)
    // const [players, setPlayers] = useState([""]);

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
        try {
            if (validateInput) {
                await createGame(name, gameId, calories, timer).then((res)=>{
                    //console.log(res);
                    setGameData((oldData)=>({
                        ...oldData,
                        gameId: res.gameSession.game_id,
                        players: res.gameSession.players,
                        //Track who is who (Initially had it for non participating players but also leader needs it)
                        currentPlayer: {"name": name, "player_id": res.leaderID},
                        gameStatus: res.gameSession.game_status,
                        foodItems: res.gameSession.food_items,
                        selectedItems: res.gameSession.selected_items,
                        leader: res.gameSession.leader,
                        caloriesGoal: res.gameSession.calories_goal,
                        timer: res.gameSession.timer,
                        winner: res.gameSession.winner
                    }));
                });
                setResponse("Successfully created a game!");
                navigate('/lobby');
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
        <div className="text-3xl h-screen flex flex-col">
            <h1 className="text-8xl text-center">Host a Game</h1>
            <div className="flex items-center justify-center flex-grow">
                <form className="bg-light-orange shadow-md rounded px-8 pt-6 pb-8 mb-4 text-center" onSubmit={handleSubmit}>
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
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-11"
                            id="name" type="text" placeholder="Enter your name (max. 10 chars)" maxLength="10" value={name} onChange={handleName} required />
                        {/* Max Players */}
                        {/* <label>
                            Max Players:
                        </label>
                        <select id="playerCount" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-11">
                            <option selected>How many?</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select> */}
                        {/* Calories goal */}
                        <label>
                            Calories Goal:
                        </label>
                        {/* Validation here!!!! a clever player can change the DOM using the HTML so either backend validate or use a function here to validate it */}
                        <input className="block shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-11 w-full"
                            id="caloriesGoal" type="number" placeholder="Calories (min. 500 cal, max. 2500 cal)" max="2500" min="500" value={calories} onChange={handleCalories} required />
                        {/* Timer */}
                        <label>
                            Timer:
                        </label>
                        {/* Validation here!!!! a clever player can change the DOM using the HTML so either backend validate or use a function here to validate it */}
                        <input className="block shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-11 w-full"
                            id="caloriesGoal" type="number" placeholder="Timer (min 30 secs)" max="9999" min="30" value={timer} onChange={handleTimer} required />
                        <p className="my-5 text-red-500">{response}</p>
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                            Create
                        </button>
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
