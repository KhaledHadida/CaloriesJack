
//This file is for the inner-part of the table that includes Skip button, Calories Limit and Timer.
//This code could be more efficient if I lift the state for variables like timer to highest level to avoid prop drilling. 

import { useGameContext } from "./GameContext";
import TimerCircle from "./TimerCircle";

//However since I am only doing it once, it's ok for now.
function Controller({ updateItemAtIndex, finishGame, refreshFood, currentFood, skip, setSkip, timer, maxTimer, caloriesGoal }) {

    const { playSound } = useGameContext();
    
    //Could reduce code here by removing this here and in Level.js then put it in GameLogic.js and pass it to children
    const incrementAndUpdate = (item) => {
        if (item == "X") setSkip(true);
        //Update it with whatever the item was
        updateItemAtIndex(item);
        //Refresh food is basically for refreshing each level the player sees
        refreshFood();
    }


    {/* Buttons & Text */ }
    return (
        <div className="flex lg:flex-col items-center justify-around h-full flex-wrap space-y-3 sm:scale-100">
            <div className="flex flex-wrap justify-center items-center space-x-4 mt-2 w-full">
                {/* Skip Button */}
                < button onClick={(() => { incrementAndUpdate("X"); playSound('Back') })} disabled={skip} className={`dark:bg-dark-gray z-50 disabled:cursor-not-allowed font-bold py-4 px-8 rounded-full ${skip ? 'bg-light-brown opacity-50' : 'bg-light-orange hover:bg-dark-orange'}`} >
                    Skip
                </button >
                {/* Suggested to have a "Confirmation Next Button" */}
                < button onClick={(() => { finishGame(); playSound('Back') })} className={`dark:bg-dark-gray z-50 disabled:cursor-not-allowed font-bold sm:py-3 sm:px-6 py-4 px-8 rounded-full bg-light-orange hover:bg-dark-orange`} >
                    Done
                </button >
                < button onClick={(() => { incrementAndUpdate(currentFood); playSound('Click') })} disabled={currentFood == null} className={`dark:bg-dark-gray z-50 disabled:cursor-not-allowed font-bold py-4 px-8 rounded-full ${currentFood == null ? 'bg-light-brown opacity-50' : 'bg-light-orange hover:bg-dark-orange'}`} >
                    Next
                </button >
            </div>

            <h1 className="mt-[1%] text-6xl">
                {caloriesGoal}
                <p className="text-sm font-medium italic">(per 100g)</p>
            </h1>
            <h1 className="">
                <TimerCircle time={timer} duration={maxTimer} />
                {/* {timer} */}
            </h1>
        </div >
    );
}

export default Controller;
