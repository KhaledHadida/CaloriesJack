import { useEffect } from "react";
import MainMenu from "./components/MainMenu";
import GameHost from "./components/GameHost";
import GameJoin from "./components/GameJoin";
import Game from "./components/Game";
import HowToPlay from "./components/HowToPlay";
import Credits from "./components/Credits";
import GameLobby from "./components/GameLobby";
import DevLogs from "./components/DevLogs";
import { GameProvider } from "./components/GameContext";
import { useGameContext } from "./components/GameContext";


//Screens
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


// ThemeHandler - so I can access the themes in useContext (GameProvider wouldnt work)
const ThemeHandler = () => {
  const { isDarkMode } = useGameContext();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return null;
};


function App() {

  return (
    <GameProvider>
      <ThemeHandler />
      <div className="bg-light-peach dark:bg-black min-h-screen w-full dark:text-white
      bg-[linear-gradient(to_right,#80808012_2px,transparent_2px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]
      dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.07)_2px,transparent_2px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)]">
        <Router>
          <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/host" element={<GameHost />} />
            <Route path="/join" element={<GameJoin />} />
            <Route path="/lobby" element={<GameLobby />} />
            <Route path="/game" element={<Game />} />
            <Route path="/how-to-play" element={<HowToPlay />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/DevLogs" element={<DevLogs />} />
          </Routes>
        </Router>
      </div>
    </GameProvider>
  );
}
export default App;
