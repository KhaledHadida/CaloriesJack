function Level({ items, selectFood, tempSelected }) {
    return (
        <div className="absolute w-full flex justify-around items-center -translate-y-24 z-20">
            {items.map((item, index) => (
                <div onClick={(() => { selectFood(item) })} key={index} className={`bg-medium-gray rounded-full h-36 w-36 flex justify-center items-center shadow-2xl cursor-pointer transition-transform duration-200 ease-in-out 
                ${tempSelected == item ? 'scale-125' : 'scale-100'}`}>
                    {item.name}
                </div>
            ))}
        </div>
    );
}

export default Level;
