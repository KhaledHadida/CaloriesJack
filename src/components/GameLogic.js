import FoodItems from "./FoodItems";
import { useEffect, useState } from "react";

// OLD GAME LOGIC PRIOR TO IMPLEMENTING REALTIME FROM DB
export const GameLogic = () => {
  const maxLevels = 6;
  //This will contain the X randomly generated food items per level..
  const [selectedItems, setSelectedItems] = useState([]);
  //This is the accumulated food items for the top bar
  const [accumulatedItems, setAccumulatedItems] = useState(Array(maxLevels).fill(null));
  //Counter for how many items player has picked out
  const [counter, setCounter] = useState(0);
  //Currently selected food item
  const [currentSelectedItem, setCurrentSelectedItem] = useState();
  //Skip amount
  const [skip, setSkip] = useState(false);

  //CALORIES GOAL
  const [caloriesGoal, setCaloriesGoal] = useState(1000);

  //TOTAL CALORIES
  const [totalCalories, setTotalCalories] = useState(0);

  //Game Status : WAITING - Party is waiting for everyone, STARTED - Game is running, FINISHED - Game is done
  const [gameStatus, setGameStatus] = useState("STARTED");

  //Timer for game
  const [timer, setTimer] = useState(60);

  //Very simple TIMER - I initially had it as its own .js file but I think here for now is better, as I have access to other variables
  useEffect(() => {
    //This ensures we're not starting at main menu 
    if (gameStatus !== "STARTED") return;

    if (timer > 0) {
      const timeoutId = setTimeout(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => {clearTimeout(timeoutId)};
    }

    if (timer === 0) {
      setGameStatus("FINISHED");
    }

  }, [timer, gameStatus]);

  //Basically updating the top bar showing the items here
  const updateItemAtIndex = (newItem) => {
    if (counter < maxLevels) {
      //Fill up the accumulated list
      setAccumulatedItems(prevItems => {
        //copy
        const copyItems = [...prevItems];

        //Modify
        copyItems[counter] = newItem;

        //Increment counter
        setCounter(counter + 1);

        //Add the calories to total
        if (!isNaN(newItem?.calories)) { setTotalCalories(totalCalories + newItem.calories); }

        console.log(totalCalories);
        //Nullify the currentSelectedItem
        setCurrentSelectedItem(null);
        //Return & "Update"
        return copyItems;
      });
    }

    if (counter === maxLevels - 1) {
      //Game is done
      setGameStatus("FINISHED");
      //Display the total calories!
    }

  };


  //Randomly selecting food items
  const randomSelectFood = () => {
    let tempSelectedItems = [];

    while (tempSelectedItems.length < maxLevels) {
      const r = Math.floor(Math.random() * FoodItems.length);
      const selectedFood = FoodItems[r];

      // Check if the food item is already selected
      if (!tempSelectedItems.includes(selectedFood)) {
        tempSelectedItems.push(selectedFood);
      }
    }

    setSelectedItems(tempSelectedItems); // Update the state once after the loop
  };


  return {
    selectedItems, randomSelectFood,
    accumulatedItems, updateItemAtIndex,
    currentSelectedItem, setCurrentSelectedItem,
    skip, setSkip,
    totalCalories, setTotalCalories,
    caloriesGoal, setCaloriesGoal,
    gameStatus, setGameStatus,
    timer, setTimer
  };
};
