import React, {useState, useEffect} from 'react';

const LoadingDots = ({text}) => {

    const [dots, setDots] = useState('');
    useEffect(()=> {
        const interval = setInterval(() => {
            setDots((prev)=> (prev.length < 3 ? prev + '.': ''));
        }, 500);

        return () => clearInterval(interval); 

    },[]);

    return <div>{text}{dots}</div>
};

export default LoadingDots;