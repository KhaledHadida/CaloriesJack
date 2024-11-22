import Level from "./components/Level";
import TopBar from "./components/TopBar";
import { GameLogic } from "./components/GameLogic";
import { useEffect, useState } from "react";
import Controller from "./components/Controller";
import MainMenu from "./components/MainMenu";
import GameHost from "./components/GameHost";
import GameJoin from "./components/GameJoin";
import Game from "./components/Game";
import HowToPlay from "./components/HowToPlay";
import Credits from "./components/Credits";
import GameLobby from "./components/GameLobby";
import DevLogs from "./components/DevLogs";
import { GameProvider } from "./components/GameContext";


//Screens
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


function App() {

  return (
    <GameProvider>
      <div className="bg-light-peach min-h-screen  w-full bg-[linear-gradient(to_right,#80808012_2px,transparent_2px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
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

    //OLD CODE
    // <div className="text-3xl font-bold min-h-screen bg-light-peach">
    //   {gameStatus === "MENU" && (
    //     <MainMenu setGameStatus={setGameStatus} />
    //   )}
    //   {(gameStatus === "STARTED" || gameStatus === "FINISHED") && (
    //     <div>
    //       {/* Top bar - basically slots for the items */}
    //       <div className="flex flex-col">
    //         <TopBar items={accumulatedItems} gameStatus={gameStatus} />
    //       </div>

    //       {/* Middle part of screen, below the Top Bar and above the Table */}
    //       <div className="flex items-center justify-center h-[250px]">
    //         {gameStatus === "FINISHED" ?
    //           (<div className="text-center">
    //             <div>
    //               Your total calories...
    //             </div>
    //             <h1 className="text-7xl">
    //               {totalCalories}
    //             </h1>
    //             <div className="mt-16">
    //               Waiting on other players to finish..
    //             </div>
    //           </div>
    //           )
    //           : ""}
    //       </div>

    //       {/* Entire Table */}
    //       <div className="fixed bottom-0 w-[95%] left-0 right-0 mx-auto">
    //         <Level
    //           items={selectedItems}
    //           selectFood={setCurrentSelectedItem}
    //           tempSelected={currentSelectedItem}
    //         />

    //         {/* Top part of table */}
    //         <div
    //           className="border-4 border-brown"
    //           style={{
    //             width: "100%",
    //             height: "75px",
    //             backgroundColor: "#aa6355",
    //             clipPath: "polygon(0 100%, 100% 100%, 95% 0, 5% 0)",
    //             position: "relative",
    //             zIndex: "1",
    //           }}
    //         ></div>

    //         {/* Bottom part of table */}
    //         <div className=" bg-dark-brown text-center h-[33vh]">
    //           <Controller
    //             updateItemAtIndex={updateItemAtIndex}
    //             refreshFood={randomSelectFood}
    //             currentFood={currentSelectedItem}
    //             skip={skip}
    //             setSkip={setSkip}
    //             timer={timer}
    //             setTimer={setTimer}
    //             caloriesGoal={caloriesGoal}
    //           />
    //         </div>
    //       </div>
    //     </div>)}
    // </div>
  );
}
export default App;
