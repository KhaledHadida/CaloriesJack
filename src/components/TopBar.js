import { useEffect, useState } from "react";
import NumberIncrement from "./NumberIncrement";

function TopBar({ items, gameStatus, images, playerDone }) {

    const [renderedItems, setRenderedItems] = useState(Array(6).fill(0));


    // Sequentially render items
    const renderItemsSequentially = async () => {

        for (let i = 0; i < items.length; i++) {
            if (items[i]?.calories) {
                //setRenderedItems((prev) => [...prev, items[i]]);
                setRenderedItems((prev) => {
                    const updatedItems = [...prev];
                    updatedItems[i] = items[i];
                    return updatedItems;
                });
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }
        }

    };


    useEffect(() => {
        console.log(playerDone);
        if (playerDone) {
            
            renderItemsSequentially().then(() => {
                //setDone(true);
                //setPlayerDone(true);
            });
        }

    }, [playerDone]);

    return (
        <div>
            <div className="flex justify-around items-center lg:mt-5">
                {
                    items.map((item, index) => (
                        <div className="sm:scale-70 lg:scale-100" key={index}>
                            <div className="bg-medium-gray h-32 w-32 border-4 border-black flex flex-col justify-center items-center">
                                {/* Temporary - I think skipped will have an X */}
                                {/* {item?.name || item} */}
                                <div className="bg-light-gray w-3/4 h-3/4 flex justify-center items-center">
                                    {images[item?.name + ".png"] ? (
                                        <div className="animate-grow duration-50">
                                            <img
                                                style={{ width: '150px', objectFit: 'contain', imageRendering: 'pixelated' }}
                                                key={index}
                                                src={images[item.name + ".png"]}
                                                alt={`Image ${item.name}`}
                                            />
                                        </div>

                                    ) : (
                                        <span key={index}>{item?.name || item}</span>
                                    )}
                                </div>
                            </div>
                            <p className=" text-center">{item?.name}</p>


                            {/* The calories of the items */}
                            {/* <div className="text-center">
                            {(gameStatus === "FINISHED") ? (
                                item.calories ? (


                                
                                <NumberIncrement value={item?.calories} />


                                ):(<></>)
                            ) :
                                ""}
                        </div> */}

                        </div>

                    ))
                }




            </div>
            {/* Here we show all cals */}
            <div className="flex justify-around items-center">
                {renderedItems.map((item, index) => (
                    <div
                        className="text-center w-32"
                        key={index}
                    >
                        {(item !== 0) && (
                            <NumberIncrement value={item?.calories || 0} />
                        )}
                    </div>
                ))}
            </div>



        </div>

    );
}

export default TopBar;
