import Level from "./Level";
import TopBar from "./TopBar";
import Controller from "./Controller";
import { useEffect, useState } from "react";
import { useGameContext } from "./GameContext";
import { leaveGame, submitScore } from "../api/gameApi";
import { supabase } from "../api/supabaseClient";
import Winners from "./Winners";
import NumberIncrement from "./NumberIncrement";
import LoadingDots from "./LoadingDots";
import { useNavigate } from "react-router-dom";


function Game() {

    //This is so we can go to next component (GameLobby)
    const navigate = useNavigate();

    //All vars come from here
    const { gameData, setGameData, playSound } = useGameContext();
    //Put this in backend perhaps?
    const maxLevels = 6;
    // const savedIndex = 0;
    const [savedIndex, setSavedIndex] = useState(0);
    //Counter for how many items player has picked out
    const [counter, setCounter] = useState(0);

    const [accumulatedItems, setAccumulatedItems] = useState(Array(maxLevels).fill(null));
    const [totalCalories, setTotalCalories] = useState(0);

    //selected items to display the user (their hot bar i guess)
    const [selectedItems, setSelectedItems] = useState([]);

    //Currently selected food item (Basically what they've picked per level)
    const [currentSelectedItem, setCurrentSelectedItem] = useState();

    //Skip amount
    const [skip, setSkip] = useState(false);

    //Timer that can be modified (I dont want to modify gameData.timer over time..)
    const [timerObj, setTimerObj] = useState(gameData.timer);

    const [gameFinished, setGameFinished] = useState(null);

    //Player has submitted (so they can wait for others to finish)
    const [playerDone, setPlayerDone] = useState(false);

    //Subbing
    const [subscription, setSubscription] = useState(null);

    //Very simple TIMER - I initially had it as its own .js file but I think here for now is better, as I have access to other variables
    useEffect(() => {
        if (gameData.gameStatus === "FINISHED") return;

        
        if (timerObj > 0) {
            if(timerObj <= 20){
                playSound('Clock');
            }
            const timeoutId = setTimeout(() => {
                setTimerObj((prevTimer) => prevTimer - 1);
            }, 1000);

            return () => { clearTimeout(timeoutId) };
        } else {
            //force users to submit what they have
            setPlayerDone(true);
            handleSubmit();
        }


    }, [timerObj]);


    //Counter to update, because without it, we get async issues 
    useEffect(() => {
        if (gameData.players.length == 0) navigate('/');

        if (counter >= maxLevels) {
            console.log("Game is done!");
            handleSubmit();
            setPlayerDone(true);
        }


    }, [counter]);



    //This useEffect is for if users leave during game (so we dont hold up users)
    useEffect(() => {

        const handleBeforeUnload = (event) => {
            //Kick player out of game basically
            handleLeave().then(() => {
                handleSubmit();
            });
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    //Basically updating the top bar showing the items here
    const updateItemAtIndex = (newItem) => {
        if (counter >= maxLevels) return;

        // Update accumulatedItems with the new item at the current counter index
        setAccumulatedItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[counter] = newItem;
            return updatedItems;
        });

        // Update totalCalories only if newItem has valid calories
        if (!isNaN(newItem?.calories)) {
            setTotalCalories(prevCalories => prevCalories + newItem.calories);
        }

        // Clear currentSelectedItem
        setCurrentSelectedItem(null);

        // Increment counter separately
        setCounter(prevCounter => prevCounter + 1);
    };


    //FInish it all
    const finishGame = () => {
        setAccumulatedItems((prev) =>
            prev.map((item) => (item === null ? 'X' : item))
        );
        setCounter(6);
    }

    //Grab the foods from the list 
    //Randomly selecting food items (based on what the user gave us)
    const randomSelectFood = () => {
        let tempSelectedItems = [];
        let loadedFoodItems = gameData.foodItems;
        let currentIndex = savedIndex;

        if (currentIndex == loadedFoodItems.length) {
            console.log("We exhausted all food items, finish!");
            return;
        }

        // Iterate through it (we only want 6 items at a time)
        for (let i = 0; i < maxLevels; i++) {
            // Add the current item to the list
            tempSelectedItems.push(loadedFoodItems[currentIndex]);

            // Move to the next index
            currentIndex++;
        }

        // Update the items list and saved index once
        setSelectedItems(tempSelectedItems);
        // Update the saved index once after the loop
        setSavedIndex(currentIndex);
    };

    //TEMPORARY - I dont want it RANDOM
    useEffect(() => {

        //subscribe to hear if EVERYONE is finished (thats all we care about in this stage)
        //Subscribe to see changes
        const sub = supabase
            .channel('public:game_sessions')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'game_sessions', filter: `game_id=eq.${gameData.gameId}` },
                (payload) => {
                    //console.log("Received update:", payload);
                    const winner = payload.new.winner;
                    if (winner !== null) {
                        console.log("Winner..!");
                        console.log(winner);

                        //Update the local variables to reflect changes here.
                        setGameData((oldData) => ({
                            ...oldData,
                            players: payload.new.players,
                            gameStatus: payload.new.game_status,
                            selectedItems: payload.new.selected_items,
                            winner: payload.new.winner
                        }));
                        //Set it
                        setGameFinished(gameData.winner);
                    }

                    //Detect if host wants to rematch.
                    const rematchCount = payload.new.rematch_counter;

                    if (rematchCount > gameData.rematchCount) {
                        //First insert the data into gameData before we send player to lobby!
                        setGameData((oldData) => ({
                            ...oldData,
                            gameStatus: payload.new.game_status,
                            foodItems: payload.new.food_items,
                            selectedItems: payload.new.selected_items,
                            winner: payload.new.winner,
                            rematchCount: rematchCount
                        }));

                        //throw the non leading players to lobby
                        navigate('/lobby');
                    }
                }
            )
            .subscribe();

        setSubscription(sub);

        //Generate the food items the player sees
        randomSelectFood();

        //Update gameStatus initially to STARTED (I realized it's been WAITING for a while)
        setGameData((oldData) => ({
            ...oldData,
            gameStatus: "STARTED"
        }));
        // Clean up the event listener on component unmount
        return () => {
            if (sub?.state === 'subscribed') {
                supabase.removeChannel(sub);
            } else {
                //console.warn("No active subscription. User might've tried to access the game without proper setup");
            }
        };

    }, []);


    //handle submit (basically submit once player is done..)
    const handleSubmit = async () => {
        try {
            await submitScore(gameData.currentPlayer.player_id, gameData.gameId, accumulatedItems).then((res) => {
                //console.log(res);
            });

        } catch (error) {
            console.log('Error submitting game results!!', error.response);
        }
    };

    //Player leaves game
    const handleLeave = async () => {
        try {
            await leaveGame(gameData.currentPlayer, gameData.gameId);
        } catch (error) {
        }

    };

    // lookup object to map player_id to player name
    const playerLookup = gameData.players.reduce((acc, player) => {
        acc[player.player_id] = player.name;
        return acc;
    }, {});

    return (
        <div className="text-3xl font-bold min-h-screen">
                {/* Top bar - basically slots for the items */}
                <div className="flex flex-col">
                    <TopBar items={accumulatedItems} images={gameData.images} playerDone={playerDone} />
                </div>

                {/* Middle part of screen, below the Top Bar and above the Table */}
                <div className="flex items-center justify-center lg:mt-7">
                    {playerDone ?
                        (<div className="text-center">
                            <div>
                                Your total calories...
                            </div>
                            <h1 className="text-7xl">
                                <NumberIncrement value={totalCalories} />
                            </h1>
                            {gameData.gameStatus === "STARTED" ? (
                                <LoadingDots text="Waiting on other players to finish" />
                            ) : (<></>)}
                        </div>
                        )
                        : ""}
                    {gameData.gameStatus === "FINISHED" ?
                        (<div className="text-center">
                            {/* <div>
                                <h3>List of Winners</h3>
                                <ul>
                                    {Object.entries(gameData.winner).map(([id, score]) => (
                                        <li key={id}>
                                            Winner: {playerLookup[id] || "Unknown"}, Score: {score}
                                        </li>
                                    ))}
                                </ul>
                            </div> */}
                            <Winners
                                players={gameData.players}
                                winner={gameData.winner}
                                currentPlayer={gameData.currentPlayer}
                                caloriesGoal={gameData.caloriesGoal}
                                gameId={gameData.gameId}
                                setGameData={setGameData}
                                amILeader={gameData.leader}
                                subscription={subscription}
                                token={gameData.token}
                            />
                        </div>
                        )
                        : ""}
                </div>

                {/* Entire Table - I hid the table and food items because on small screens it takes too much space. */}
                <div className={`fixed bottom-0 w-[95%] left-0 right-0 mx-auto ${playerDone ? 'hidden' : ''} lg:block flex-grow`}>
                    {/* This is 6 items you will see */}
                    <Level
                        items={selectedItems}
                        selectFood={setCurrentSelectedItem}
                        tempSelected={currentSelectedItem}
                        images={gameData.images}
                    />

                    {/* Top part of table */}
                    <div
                        className="border-4 border-brown"
                        style={{
                            width: "100%",
                            height: "75px",
                            backgroundColor: "#aa6355",
                            clipPath: "polygon(0 100%, 100% 100%, 95% 0, 5% 0)",
                            position: "relative",
                            zIndex: "1",
                        }}
                    >
                    </div>

                    {/* Bottom part of table */}
                    <div className=" bg-dark-brown text-center lg:h-[33vh]">
                        <Controller
                            updateItemAtIndex={updateItemAtIndex}
                            refreshFood={randomSelectFood}
                            finishGame={finishGame}
                            currentFood={currentSelectedItem}
                            skip={skip}
                            setSkip={setSkip}
                            timer={timerObj}
                            maxTimer={gameData.timer}
                            setTimer={setTimerObj}
                            caloriesGoal={gameData.caloriesGoal}
                        />
                    </div>
                </div>
           
        </div>
    );
}

export default Game;
