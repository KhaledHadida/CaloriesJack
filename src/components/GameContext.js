import React, { createContext, useContext, useState } from 'react';

//Import sounds
import clickSound from '../assets/sounds/Click.wav';
import backSound from '../assets/sounds/Back.wav';
import clockSound from '../assets/sounds/Clock.wav';
import modeSound from '../assets/sounds/Mode.wav';
import startSound from '../assets/sounds/Start.wav';
import wonSound from '../assets/sounds/Won.wav';

//Create a Context for the game session (Think of it as a singelton from Unity C#)
//for v2.2, I added sounds here since I do not have many sounds (Could create a separate context)
const GameContext = createContext();

//Create Provider (At first all is uninitialized)
export const GameProvider = ({ children }) => {
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
        rematchCount: 0,
        token: null,
    });

    //Theme
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');


    //Sound dictionary
    const sounds = {
        "Click": clickSound,
        "Back": backSound,
        "Clock": clockSound,
        "Mode": modeSound,
        "Start": startSound,
        "Won": wonSound
        
    }

    //Sounds
    // Function to play a sound
    const playSound = (audioKey) => {
        const audio = new Audio(sounds[audioKey]);
        audio.play();
    };


    return (
        <GameContext.Provider value={{ gameData, setGameData, isDarkMode, setIsDarkMode, playSound }}>
            {children}
        </GameContext.Provider>
    );

};

export const useGameContext = () => {
    return useContext(GameContext);
};
