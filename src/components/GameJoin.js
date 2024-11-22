import { useEffect, useState } from "react";
import { useGameContext } from "./GameContext";
import { joinGame } from "../api/gameApi";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";


function GameJoin() {
    //Global access of game properties
    const { setGameData } = useGameContext();

    //This is so we can go to next component (GameLobby)
    const navigate = useNavigate();


    //ID for game session
    const [gameId, setGameId] = useState(0);
    //Handle name
    const handleGame = (e) => {
        setGameId(e.target.value);
    }

    //Name
    const [name, setName] = useState("");
    //Handle name
    const handleName = (e) => {
        setName(e.target.value);
    }

    //error
    const [response, setResponse] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (validateInput) {
                await joinGame(name, gameId).then((res) => {
                    //console.log(res);
                    setGameData((oldData) => ({
                        ...oldData,
                        gameId: res.gameSession.game_id,
                        players: res.gameSession.players,
                        //To track who is who basically, having a players list alone is not enough
                        currentPlayer: {"name": name, "player_id": res.player_id},
                        gameStatus: res.gameSession.game_status,
                        foodItems: res.gameSession.food_items,
                        selectedItems: res.gameSession.selected_items,
                        //Leader is undefined here purposely (I hid it)
                        leader: res.gameSession.leader,
                        caloriesGoal: res.gameSession.calories_goal,
                        timer: res.gameSession.timer,
                        winner: res.gameSession.winner,
                        rematchCount: res.gameSession.rematch_counter
                    }));
                });
                setResponse("Successfully joined a game!");
                navigate('/lobby');
            }
        } catch (error) {
            setResponse(error.message);
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

        //All is good
        return true;
    }

    return (
        <div className="h-full flex flex-col text-3xl">
            <BackButton />
            <h1 className="text-6xl md:text-8xl lg:text-center text-right my-5">Join a Game</h1>
            <div className="flex flex-grow items-center justify-center">
                <form className="bg-light-orange shadow-md rounded px-8 pt-6 pb-8 mb-4 text-center" onSubmit={handleSubmit}>
                    <label>
                        Please input Game Session ID
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-11"
                        id="gameID" type="number" placeholder="Game ID (up to 4 digits)" max="9999" min="0" onChange={handleGame} value={gameId} required />


                    <label>
                        Your Name:
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-11"
                        id="name" type="text" placeholder="Enter your name (max. 10 chars)" maxLength="10" value={name} onChange={handleName} required />
                    <p className="my-5 text-red-500">{response}</p>
                    <button className="bg-green-500 hover:bg-green-700 text-white py-2 w-1/2 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Join
                    </button>
                </form>
            </div>
        </div>

    );
}

export default GameJoin;
