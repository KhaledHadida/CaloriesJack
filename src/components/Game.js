import Level from "./Level";
import TopBar from "./TopBar";
import Controller from "./Controller";
import { useEffect, useState } from "react";
import { useGameContext } from "./GameContext";
import { submitScore } from "../api/gameApi";
import { supabase } from "../api/supabaseClient";
import Winners from "./Winners";


function Game() {
    //All vars come from here
    const { gameData, setGameData } = useGameContext();
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


    //Very simple TIMER - I initially had it as its own .js file but I think here for now is better, as I have access to other variables
    useEffect(() => {
        if (gameData.gameStatus === "FINISHED") return;


        if (timerObj > 0) {
            const timeoutId = setTimeout(() => {
                setTimerObj((prevTimer) => prevTimer - 1);
            }, 1000);

            return () => { clearTimeout(timeoutId) };
        }else{
            //force users to submit what they have
            handleSubmit();
        }


    }, [timerObj]);


    //Counter to update, because without it, we get async issues 
    useEffect(() => {
        if (counter >= maxLevels) {
            console.log("Game is done!");
            handleSubmit();
            setPlayerDone(true);
        }
    }, [counter]);


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

            //console.log(`Item ${currentIndex}:`, loadedFoodItems[currentIndex]);

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
        const subscription = supabase
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
                }
            )
            .subscribe();

        //Generate the food items the player sees
        randomSelectFood();

        // Clean up the event listener on component unmount
        return () => {
            supabase.removeChannel(subscription);
        };

    }, []);


    //handle submit (basically submit once player is done..)
    const handleSubmit = async () => {
        try {
            console.log("This is what we have selected");
            console.log(accumulatedItems);
            console.log("This is what we have selected");

            await submitScore(gameData.currentPlayer.player_id, gameData.gameId, accumulatedItems).then((res) => {
                //console.log(res);
            });
            //navigate('/lobby');

        } catch (error) {
            console.log('Error submitting game results!!', error.response);
        }
    };

    // lookup object to map player_id to player name
    const playerLookup = gameData.players.reduce((acc, player) => {
        acc[player.player_id] = player.name;
        return acc;
    }, {});



    return (
        <div className="text-3xl font-bold min-h-screen">
            <div>
                {/* Top bar - basically slots for the items */}
                <div className="flex flex-col">
                    <TopBar items={accumulatedItems} gameStatus={gameData.gameStatus} />
                </div>

                {/* Middle part of screen, below the Top Bar and above the Table */}
                <div className="flex items-center justify-center h-[250px]">
                    {playerDone ?
                        (<div className="text-center">
                            <div>
                                Your total calories...
                            </div>
                            <h1 className="text-7xl">
                                {totalCalories}
                            </h1>
                            <div className="mt-16">
                                Waiting on other players to finish..
                            </div>
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
                            />
                        </div>
                        )
                        : ""}
                </div>

                {/* Entire Table */}
                <div className="fixed bottom-0 w-[95%] left-0 right-0 mx-auto">
                    <Level
                        items={selectedItems}
                        selectFood={setCurrentSelectedItem}
                        tempSelected={currentSelectedItem}
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
                    ></div>

                    {/* Bottom part of table */}
                    <div className=" bg-dark-brown text-center h-[33vh]">
                        <Controller
                            updateItemAtIndex={updateItemAtIndex}
                            refreshFood={randomSelectFood}
                            currentFood={currentSelectedItem}
                            skip={skip}
                            setSkip={setSkip}
                            timer={timerObj}
                            setTimer={setTimerObj}
                            caloriesGoal={gameData.caloriesGoal}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Game;
