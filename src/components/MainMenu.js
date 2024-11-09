import { Link } from 'react-router-dom';

function MainMenu() {
    return (
        <div>
            <div className="flex flex-col items-center justify-center min-h-screen text-3xl font-bold">
                <h1 className="text-8xl mb-14">CarloiesJack.</h1>
                <Link to="/host"
                    onClick={() => { }}
                    className="bg-light-orange hover:bg-dark-orange text-white font-bold py-4 px-8 rounded-full m-4 shadow-xl"
                >
                    Host Game
                </Link>
                <Link to="/join"
                    className="bg-light-orange hover:bg-dark-orange text-white font-bold py-4 px-8 rounded-full m-4 shadow-xl"
                >
                    Join Game
                </Link>
                <Link to="/how-to-play"
                    className="bg-light-orange hover:bg-dark-orange text-white font-bold py-4 px-8 rounded-full m-4 shadow-xl"
                >
                    How to Play
                </Link>
            </div>
            <div className='text-2xl font-semibold fixed bottom-5 left-5 text-gray-600'>Version 1.0</div>
        </div>

    );
}

export default MainMenu;
