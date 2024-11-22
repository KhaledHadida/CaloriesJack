import { Link } from 'react-router-dom';

function MainMenu() {
    return (
        <div>
            <div className="flex flex-col items-center justify-center min-h-screen text-3xl ">
                <h1 className="text-6xl lg:text-8xl sm:text-8xl mb-14">CaloriesJack.</h1>
                <Link to="/host"
                    className="bg-light-orange hover:bg-dark-orange text-white py-4 px-8 rounded-full m-4 shadow-xl transform transition-transform duration-200 hover:scale-110"
                >
                    Host Game
                </Link>
                <Link
                    to="/join"
                    className="bg-light-orange hover:bg-dark-orange text-white py-4 px-8 rounded-full m-4 shadow-xl transform transition-transform duration-200 hover:scale-110"
                >
                    Join Game
                </Link>
                <Link to="/how-to-play"
                    className="bg-light-orange hover:bg-dark-orange text-white py-4 px-8 rounded-full m-4 shadow-xl transform transition-transform duration-200 hover:scale-110"
                >
                    How to Play
                </Link>
            </div>
            <div className='text-2xl font-semibold fixed bottom-5 left-5 text-gray-600'>Version 2.0</div>
            <Link to="/Credits"
                className="text-sm font-semibold fixed bottom-1 left-12 text-gray-600"
            >
                Credits
            </Link>
            <Link to="/DevLogs"
                className=" text-2xl font-semibold fixed bottom-5 right-5 text-gray-600"
            >
                Dev Logs
            </Link>
        </div>

    );
}

export default MainMenu;
