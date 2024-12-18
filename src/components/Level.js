//This is to display all of the food items on the table with name on top of the image.
function Level({ items, selectFood, tempSelected, images }) {
    return (
        <div className="absolute w-full flex justify-around items-center -translate-y-[50%] z-20 scale-90  sm:scale-100 ">
            {items.map((item, index) => (
                    <div key={index} onClick={(() => { selectFood(item) })} className={
                        ` cursor-pointer transition-transform duration-200 ease-in-out lg:w-32 sm:w-24 
                ${tempSelected == item ? 'scale-150 pointer-events-none' : 'scale-100'}`}>
                        {images[item.name + ".png"] ? (
                            <div className="sm:-translate-y-3 sm:scale-70 lg:scale-100 lg:-translate-y-9 w-full flex flex-col ">
                                <div>
                                    <p className="text-center text-md sm:text-3xl w-[50px] sm:w-full">{item.name}</p>
                                    <img

                                        style={{ width: '150px',  objectFit: 'contain', imageRendering: 'pixelated', filter: 'drop-shadow(0 25px 8px rgba(0, 0, 0, 0.3))', }}
                                        key={index}
                                        src={images[item.name + ".png"]}
                                        alt={`Image ${item.name}`}
                                    />
                                </div>
                            </div>

                        ) : (
                            <div className="bg-medium-gray rounded-full shadow-2xl h-36 w-36 flex justify-center items-center">
                                <span key={index}>{item?.name || item}</span>
                            </div>
                        )}
                    </div>
                
            ))}
        </div>
    );
}

export default Level;
