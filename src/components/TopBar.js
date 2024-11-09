import { useEffect } from "react";

function TopBar({ items, gameStatus }) {
    useEffect(() => {
        console.log(items);
    }, [])
    return (
        <div className="flex justify-around items-center m-5">
            {
                items.map((item, index) => (
                    <div key={index}>
                        <div className="bg-medium-gray h-32 w-32 border-4 border-black flex flex-col justify-center items-center">
                            <div className="bg-light-gray w-3/4 h-3/4 ">
                                {/* Temporary - I think skipped will have an X */}
                                {item?.name || item}
                            </div>
                        </div>
                        {/* The calories of the items */}
                        <div className="text-center">
                            {(gameStatus === "FINISHED") ? (
                                item?.calories
                            ) :
                                ""}
                        </div>
                    </div>

                ))
            }
        </div>
    );
}

export default TopBar;
