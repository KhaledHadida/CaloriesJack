import React, { createContext, useContext, useState } from 'react';

//Create a Context for the game session (Think of it as a singelton from Unity C#)
const GameContext = createContext();

//Create Provider (At first all is uninitialized)
export const GameProvider = ({children}) => {
    const [gameData, setGameData] = useState({
        gameId: null,
        players: [],
        currentPlayer: "",
        gameStatus: 'WAITING',
        foodItems: [],
        selectedItems: {},
        leader: null,
        caloriesGoal: 1000,
        timer: 60,
        winner: null,
        //This is to store all the images for the food
        images: {},
        rematchCount: 0
    });


    return(
        <GameContext.Provider value={{gameData, setGameData}}>
            {children}
        </GameContext.Provider>
    );

};

export const useGameContext = () => {
    return useContext(GameContext);
};
