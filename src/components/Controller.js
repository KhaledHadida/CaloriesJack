
//This file is for the inner-part of the table that includes Skip button, Calories Limit and Timer.
//This code could be more efficient if I lift the state for variables like timer to highest level to avoid prop drilling. 
//However since I am only doing it once, it's ok for now.
function Controller({ updateItemAtIndex, refreshFood, currentFood, skip, setSkip, timer, caloriesGoal }) {

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
        < div className="flex flex-col items-center justify-around h-[300px]">
            <div className="flex space-x-7">
                {/* Skip Button */}
                < button onClick={(() => { incrementAndUpdate("X") })} disabled={skip} className={`disabled:cursor-not-allowed bg-light-orange font-bold py-4 px-8 rounded-full ${skip ? 'bg-dark-gray opacity-50' : 'hover:bg-dark-orange'}`} >
                    Skip
                </button >
                {/* Suggested to have a "Confirmation Next Button" */}
                < button onClick={(() => { incrementAndUpdate(currentFood) })} disabled={currentFood == null} className={`disabled:cursor-not-allowed font-bold py-4 px-8 rounded-full ${currentFood == null ? 'bg-dark-gray opacity-50' : 'bg-light-orange hover:bg-dark-orange'}`} >
                    Next
                </button >
            </div>

            <h1 >
                {caloriesGoal}
                <p className="text-sm font-medium italic">(per 100g)</p>
            </h1>
            <h1>
                {timer}
            </h1>
        </div >
    );
}

export default Controller;
