import React, { useState, useEffect } from 'react';


//This is for numbers being incremented.
const NumberIncrement = ({ value, duration = 2000 }) => {
    const [currentValue, setCurrentValue] = useState(0);

    useEffect(() => {

        //Calculate increment per frame 
        const totalSteps = value;
        const intervalDuration = duration / totalSteps;

        const interval = setInterval(() => {
            setCurrentValue(prev => {
                if (prev + 1 >= value) {
                    //Stop the count!
                    clearInterval(interval);
                    return value;
                }
                return prev + 1;
            });

        }, intervalDuration);

        //Return - clean and unmount
        return () => clearInterval(interval);

    }, [value, duration]);


    return (
        <div>
            {Math.floor(currentValue)}
        </div>
    );
};

export default NumberIncrement;