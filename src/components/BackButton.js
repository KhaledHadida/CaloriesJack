import React from 'react';
import { useNavigate } from 'react-router-dom';
//Go back
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useGameContext } from './GameContext';

//Back button for every component
const BackButton = () => {
    const navigate = useNavigate();
    const { playSound } = useGameContext();

    return (
        <div className="fixed top-5 left-5 cursor-pointer" onClick={() => {navigate(-1); playSound('Back') }}>
            < IoArrowBackCircleSharp size={75} />
        </div>
    );
};

export default BackButton;
