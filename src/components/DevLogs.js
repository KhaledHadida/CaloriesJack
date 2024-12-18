import BackButton from "./BackButton";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";

//Dev logs showcasing all of my past contributions to the game
function DevLogs() {
    return (
        <div className="flex flex-col items-center w-full">
            <BackButton />
            <h1 className="text-6xl md:text-8xl lg:text-center text-right mt-5">Log History of Development</h1>
            <h1 className="text-4xl font-bold underline">Potential Future Updates (?)</h1>

            {/* List for Potential Future Updates */}
            <ul className="list-disc text-xl sm:text-3xl mx-5 list-inside space-y-3">
                <li>More customization in game lobbies (i.e cals per X grams, number of skips, etc)</li>
                <li>Increase food items pool from 100 to 500 (maybe.. I need the art)</li>
                <div className="flex justify-center">
                    < MdKeyboardDoubleArrowDown size={75} />
                </div>
            </ul>
            <h1 className="mt-14 text-4xl font-bold underline">Version 2.2: Sounds</h1>
            {/* List for Version 2.2 */}
            <ul className="list-disc text-xl sm:text-3xl mx-5 list-inside space-y-3">
                <li>Added sounds to the game</li>
                <li>Fixed theme bug where if user refreshes in any screens other than Main Menu it goes back to default</li>

            </ul>

            <h1 className="mt-14 text-4xl font-bold underline">Version 2.1: Mostly Bug Fixes</h1>

            {/* List for Version 2.1 */}
            <ul className="list-disc text-xl sm:text-3xl mx-5 list-inside space-y-3">
                <li>Fixed non-leader players being forced into rematch after leaving at end of the game.</li>
                <li>"Unknown" players no longer appears on results table if player chooses to leave.</li>
                <li>Added Show/Hide button for results table at end of the game.</li>
                <li>Updated instructions for playing the game.</li>
                <li>Fixed players having unauthorized access to lobby & game.</li>
                <li>Added tips in lobby while waiting for others.</li>
                <li>Added in game timer clock animation.</li>
                <li>Fixed it so players who leave mid-game have their scores removed.</li>
                <li>Further improved Mobile UI (added both landscape and portrait support)</li>
                <li>Added dark mode</li>
            </ul>

            <h1 className="mt-14 text-4xl font-bold underline">Version 2.0</h1>

            {/* List for Version 2.0 */}
            <ul className="list-disc text-xl sm:text-3xl mx-5 list-inside space-y-3">
                <li>Added food images, however these images may be subject to change.</li>
                <li>Added in-game animations</li>
                <li>New Font: Jersey 10</li>
                <li>Added Log History of Development</li>
                <li>Added Back Button</li>
                <li>Added Crown to indicate party leader & if leader leaves then the game is disbanded</li>
                <li>Added the feature to rematch games (helps with backend)</li>
                <li>Finally <a className="font-bold">bit more</a> mobile responsiveness (yay!)</li>
            </ul>

            <h1 className="mt-14 text-4xl font-bold underline">Version 1.0</h1>

            {/* List for Version 1.0 */}
            <ul className="list-disc text-xl sm:text-3xl mx-5 list-inside space-y-3">
                <li>Game logic fully made (no images, no animations, no sounds)</li>
                <li>Added 100 food items with calories (randomly chosen thanks to ChatGPT!)</li>
                <li>Singleplayer <a className="italic font-bold">accidentally</a> added (can play alone)</li>
                <li>Multiplayer added (can play with friends)</li>
                <li>Ditched Firebase for Supabase (Backend stuff)</li>
                <li>Added Main Menu, Host Game, Join Game, How to Play</li>
            </ul>
        </div>

    );
}

export default DevLogs;
