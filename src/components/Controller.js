
//This file is for the inner-part of the table that includes Skip button, Calories Limit and Timer.
//This code could be more efficient if I lift the state for variables like timer to highest level to avoid prop drilling. 

import TimerCircle from "./TimerCircle";

//However since I am only doing it once, it's ok for now.
function Controller({ updateItemAtIndex, finishGame, refreshFood, currentFood, skip, setSkip, timer, maxTimer, caloriesGoal }) {

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
        <div className="flex scale-80 lg:flex-col items-start lg:items-center justify-around h-full flex-wrap space-y-3 sm:scale-100">
            <div className="flex space-x-7 mt-[1%]">
                {/* Skip Button */}
                < button onClick={(() => { incrementAndUpdate("X") })} disabled={skip} className={`dark:bg-dark-gray z-50 disabled:cursor-not-allowed font-bold py-4 px-8 rounded-full ${skip ? 'bg-light-brown opacity-50' : 'bg-light-orange hover:bg-dark-orange'}`} >
                    Skip
                </button >
                {/* Suggested to have a "Confirmation Next Button" */}
                < button onClick={(() => { finishGame() })} className={`dark:bg-dark-gray z-50 disabled:cursor-not-allowed font-bold py-4 px-8 rounded-full bg-light-orange hover:bg-dark-orange`} >
                    Done
                </button >
                < button onClick={(() => { incrementAndUpdate(currentFood) })} disabled={currentFood == null} className={`dark:bg-dark-gray z-50 disabled:cursor-not-allowed font-bold py-4 px-8 rounded-full ${currentFood == null ? 'bg-light-brown opacity-50' : 'bg-light-orange hover:bg-dark-orange'}`} >
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
