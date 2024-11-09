import { GameLogic } from "./GameLogic";
import Level from "./Level";
import TopBar from "./TopBar";
import Controller from "./Controller";
import { useEffect } from "react";
import { useGameContext } from "./GameContext";


//OLD CODE - DELETE LATER
function Game() {
    //All vars come from here
    const { gameData } = useGameContext();

    //Randomly assign food items here
    const { selectedItems, randomSelectFood,
        accumulatedItems, updateItemAtIndex,
        currentSelectedItem, setCurrentSelectedItem,
        skip, setSkip,
        totalCalories, setTotalCalories,
        caloriesGoal, setCaloriesGoal,
        gameStatus, setGameStatus,
        timer, setTimer } = GameLogic();
        
        //TEMPORARY - I dont want it RANDOM, rather 
    useEffect(() => {
        randomSelectFood();
    }, []);


    return (
        <div className="text-3xl font-bold min-h-screen">
            <div>
                {/* Top bar - basically slots for the items */}
                <div className="flex flex-col">
                    <TopBar items={accumulatedItems} gameStatus={gameStatus} />
                </div>

                {/* Middle part of screen, below the Top Bar and above the Table */}
                <div className="flex items-center justify-center h-[250px]">
                    {gameStatus === "FINISHED" ?
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
                            timer={timer}
                            setTimer={setTimer}
                            caloriesGoal={caloriesGoal}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Game;
