import React from 'react';
import { useNavigate } from 'react-router-dom';
//Go back
import { IoArrowBackCircleSharp } from "react-icons/io5";


const BackButton = () => {
    const navigate = useNavigate();

    return (
        <div className="fixed top-5 left-5 cursor-pointer" onClick={() => navigate(-1)}>
            < IoArrowBackCircleSharp size={75} />
        </div>
    );
};

export default BackButton;
