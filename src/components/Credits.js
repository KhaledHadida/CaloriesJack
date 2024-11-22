import BackButton from "./BackButton";

function Credits() {
    return (
        <div className="flex flex-col sm:items-center h-screen">
            <BackButton/>
            <h1 className="text-4xl sm:text-8xl mb-14 text-right">Credits for assets used</h1>
            <ul>
                <li>
                    Flat design pixel food illustration by rawpixel.com on Freepik - <a href="https://www.freepik.com/free-vector/flat-design-pixel-food-illustration_37984219.htm#">Link to Asset</a>
                </li>
                <li>
                    Flat design pixel art food illustration by rawpixel.com on Freepik - <a href="https://www.freepik.com/free-vector/flat-design-pixel-art-food-illustration_38528646.htm">Link to Asset</a>
                </li>
                <li>
                    Fall harvest elements in pixel art by rawpixel.com on Freepik - <a href="https://www.freepik.com/free-vector/fall-harvest-elements-pixel-art_31194630.htm">Link to Asset</a>
                </li>
            </ul>
        </div>
    );
}

export default Credits;
