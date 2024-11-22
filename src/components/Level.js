function Level({ items, selectFood, tempSelected, images }) {
    return (
        <div className="absolute w-full flex justify-around items-center -translate-y-24 z-20">
            {items.map((item, index) => (
                <div key={index}>
                    <div onClick={(() => { selectFood(item) })} className={`cursor-pointer transition-transform duration-200 ease-in-out 
                ${tempSelected == item ? 'scale-125 z-10' : 'scale-100'}`}>
                        {/* {item.name} */}

                        {images[item.name + ".png"] ? (
                            <div className="sm:-translate-y-3 sm:scale-70 lg:scale-100 lg:-translate-y-9">
                                <p className="text-center text-md">{item.name}</p>
                                <img
                                    style={{ width: '150px', height: '150px', objectFit: 'contain', imageRendering: 'pixelated', filter: 'drop-shadow(0 25px 8px rgba(0, 0, 0, 0.3))', }}
                                    key={index}
                                    src={images[item.name + ".png"]}
                                    alt={`Image ${item.name}`}
                                />
                            </div>

                        ) : (
                            <div className="bg-medium-gray rounded-full shadow-2xl h-36 w-36 flex justify-center items-center">
                                <span key={index}>{item?.name || item}</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Level;
