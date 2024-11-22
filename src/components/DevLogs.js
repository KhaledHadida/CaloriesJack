import BackButton from "./BackButton";

function DevLogs() {
    return (
        <div className="flex flex-col items-center w-full">
            <BackButton />
            <h1 className="text-6xl md:text-8xl lg:text-center text-right mt-5">Log History of Development</h1>
            <h1 className="text-4xl font-bold underline">Potential Future Updates</h1>

            {/* List for Potential Future Updates */}
            <ul className="list-disc text-xl sm:text-3xl mx-5 list-inside space-y-3">
                <li>Sounds when buttons pressed</li>
                <li>Further improvement to the UI (i.e game host & join)</li>
                <li>Fix mobile responsiveness for portrait mode (as of now it's not suitable for it, please play landscape!)</li>
                <li>More customization in game lobbies (i.e cals per X grams, number of skips, etc)</li>
                <li>Themes (like dark & light mode)</li>
                <li>Increase food items pool from 100 to 500 (maybe.. I need the art)</li>
            </ul>

            <h1 className="text-4xl font-bold underline">Version 2.0</h1>

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