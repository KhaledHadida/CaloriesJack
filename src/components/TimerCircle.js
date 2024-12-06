import { useEffect, useState } from "react"

const TimerCircle = ({ time, duration }) => {

    const normalizedTime = time / duration;
    const circumference = 2 * Math.PI * 45;
    const offset = circumference * (1 - normalizedTime);

    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setIsDarkMode(isDark);
    }, []);


    return (
        <div className="relative flex justify-center items-center">
            <svg width={"100"} height={"100"}>
                {/* Background */}
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#e0e0e0"
                    strokeWidth="10"
                    fill="none"
                />
                {/* Progress */}
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke={isDarkMode ? '#8fa8ae' : '#f76c6c'} 
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{
                        transition: "stroke-dashoffset 0.5s linear",
                    }}
                />
            </svg>
            <div className={`absolute text-4xl font-bold ${time <= 20 && time > 0 ? 'animate-ping text-red-600' : ''}`}>
                {Math.ceil(time)}
            </div>
        </div>
    )
}

export default TimerCircle;