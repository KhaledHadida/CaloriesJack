import { IoFastFoodOutline } from "react-icons/io5";
import { FaRepeat } from "react-icons/fa6";
import { HiRectangleStack } from "react-icons/hi2";
import { GoGoal } from "react-icons/go";
import BackButton from "./BackButton";


function HowToPlay() {
    return (
        <div className="flex flex-col items-center h-full">
            <BackButton/>
            <h1 className="text-8xl mb-14 text-right">How to play? Simple.</h1>
            <div className="flex flex-col gap-10 text-4xl h-full">
                <div className="flex items-center gap-10">
                    {/* icon and text */}
                    <div className="rounded-full bg-dark-orange p-5 text-gray-100 shadow-xl">
                        <GoGoal size={100} />
                    </div>
                    <p>Do NOT exceed calories limit, but try to have highest calories score. </p>
                </div>

                <div className="flex items-center gap-10">
                    {/* icon and text */}
                    <div className="rounded-full bg-dark-orange p-5 text-gray-100 shadow-xl">
                        <HiRectangleStack size={100} />
                    </div>
                    <p>You are given 6 levels of food items to pick from.</p>
                </div>

                <div className="flex items-center gap-10">
                    {/* icon and text */}
                    <div className="rounded-full bg-dark-orange p-5 text-gray-100 shadow-xl">
                        <IoFastFoodOutline size={100} />
                    </div>
                    <p>Pick a food item from the list presented to you!</p>
                </div>

                <div className="flex items-center gap-10">
                    {/* icon and text */}
                    <div className="rounded-full bg-dark-orange p-5 text-gray-100 shadow-xl">
                        <FaRepeat size={100} />
                    </div>
                    <p>Repeat for each level until you reach the end.</p>
                </div>
            </div>
            <p className="font-semibold mt-14 mx-5">Note: Please play with a friend, you can play alone but it's not as fun (nor was it intended)</p>
            <p className="italic font-bold mb-5">..Have fun!</p>
        </div>
    );
}

export default HowToPlay;
