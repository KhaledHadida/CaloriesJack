import { Link } from 'react-router-dom';
import { useGameContext } from "./GameContext";
//Main menu with all the buttons of hosting, joining and how to play
function MainMenu() {
    const { isDarkMode, setIsDarkMode, playSound } = useGameContext();
    return (
        <div>
            <label className="fixed right-5 top-5 cursor-pointer flex flex-col items-center">
                <input type="checkbox" value="" className="sr-only peer" checked={isDarkMode} onClick={()=>{playSound('Mode')}} onChange={() => setIsDarkMode(!isDarkMode)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                    peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                     peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px]  after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className=" font-medium text-gray-900 dark:text-light-gray text-center">
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </span>
            </label>
            <div className="flex flex-col items-center justify-center min-h-screen text-3xl ">
                <h1 className="text-6xl lg:text-8xl sm:text-8xl mb-14">CaloriesJack.</h1>
                <Link to="/host" onClick={()=>{playSound('Click')}}
                    className="bg-light-orange dark:bg-dark-gray hover:bg-dark-orange text-white py-4 px-8 rounded-full m-4 shadow-xl transform transition-transform duration-200 hover:scale-110"
                >
                    Host Game
                </Link>
                <Link
                    to="/join" onClick={()=>{playSound('Click')}}
                    className="bg-light-orange dark:bg-dark-gray hover:bg-dark-orange text-white py-4 px-8 rounded-full m-4 shadow-xl transform transition-transform duration-200 hover:scale-110"
                >
                    Join Game
                </Link>
                <Link to="/how-to-play" onClick={()=>{playSound('Click')}}
                    className="bg-light-orange dark:bg-dark-gray hover:bg-dark-orange text-white py-4 px-8 rounded-full m-4 shadow-xl transform transition-transform duration-200 hover:scale-110"
                >
                    How to Play
                </Link>
            </div>
            <div className='dark:text-light-gray text-2xl font-semibold fixed bottom-5 left-5 text-gray-600'>Version 2.2</div>
            <Link to="/Credits" onClick={()=>{playSound('Click')}}
                className="dark:text-light-gray text-sm font-semibold fixed bottom-1 left-12 text-gray-600"
            >
                Credits
            </Link>
            <Link to="/DevLogs" onClick={()=>{playSound('Click')}}
                className="dark:text-light-gray text-2xl font-semibold fixed bottom-5 right-5 text-gray-600"
            >
                Dev Logs
            </Link>
        </div>

    );
}

export default MainMenu;
