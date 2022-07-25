import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { isCooking } from "../atom/isCooking";
import { stockIngredients } from "../atom/my-stock";
import axios from "axios";
import Ingredients from "./ingredients";
import "../styles/cook-recipe-card.css";
import { recipesState } from "../atom/recipes-atom";
import { alertData } from "../atom/alertData";

export default function CookRecipeCard({ recipe }) {
  const [stock, setStock] = useRecoilState(stockIngredients);
  const [alertBoxData, setAlertBoxData] = useRecoilState(alertData);
  const [isBurnt, setIsBurnt] = useState(false);
  const [isStocksAvailable, SetIsStocksAvailable] = useState(true);
  const [isStopLoop, set_isStopLoop] = useState(false);
  const ingredients = recipe.ingredients;
  const [recipieBeignCooked, set_recipieBeignCooked] = useState(null);
  // const [remainingTime, set_remainingTime] = useState(null);
  const [secs, set_secs] = useState(120);
  // const [widthInPer, set_widthInPer] = useState(null);
  const [isCookingb, set_isCookingb] = useRecoilState(isCooking);
  const [allRecipes, set_allRecipes] = useRecoilState(recipesState);

  const checkIsCook = (recipe) => {
    // message for cooking started
    setAlertBoxData({
      heading: "Success!",
      message: "Cooking has been started.",
    });
    set_recipieBeignCooked(recipe.id);
    recipe.ingredients.map((item) => {
      let newValue = stock[item.ingredientId].availableQuantity - item.quantity;
      axios.put(`http://localhost:3000/fridge/${item.ingredientId}`, {
        id: item.ingredientId,
        ingredientId: item.ingredientId,
        availableQuantity: newValue,
      });
    });

    set_isCookingb(true);

    // saving cooking time to state
    set_secs(() => {
      let secs = recipe.duration * 60;
      return secs;
    });

    // starting timmer for cooking
    const interval = setInterval(() => {
      set_secs((prev) => {
        let newData;

        if (prev > 0) {
          newData = prev - 1;
        } else {
          newData = 0;
          clearInterval(interval);
        }
        return newData;
      });
    }, 1000);

    // message box for cooking completion
    setTimeout(() => {
      setAlertBoxData({
        heading: "Success!",
        message:
          "Your Dish is Successfully Cooked! Eat it, otherwise it will be burnt in 30 seconds.",
      });
      set_isCookingb(false);
    }, recipe.duration * 60 * 1000);

    // message box for dishe burn
    setTimeout(() => {
      setAlertBoxData({
        heading: "Ouch!",
        message: "Ouch Dish is Burnt",
      });
      setIsBurnt(true);
    }, recipe.duration * 60 * 1000 + 30000);
  };

  const deleteRecipe = async () => {
    // deleting from database
    await axios
      .delete(`http://localhost:3000/pre-recipes/${recipe.id}`)
      .then((res) => {
        // deleting from state
        set_allRecipes((prev) => {
          let newRecipes = [];
          prev?.map((item) => {
            if (item.id == recipe.id) {
              console.log("");
            } else {
              newRecipes.push(item);
            }
          });
          return [...newRecipes];
        });
      });
  };

  useEffect(() => {
    ingredients?.map((ingredient) => {
      stock?.map((i) => {
        if (ingredient.ingredientId == i.ingredientId) {
          if (ingredient.quantity > i.quantity) {
            SetIsStocksAvailable(false);
          }
        }
      });
    }, []);

    if (recipe?.ingredients?.length > stock?.length) {
    } else {
      for (let i = 0; i < recipe.ingredients.length; i++) {
        if (isStopLoop == false) {
          if (
            recipe?.ingredient?.length > 0 &&
            recipe?.ingredients[i].ingredientId == stock[i].ingredientId
          ) {
            if (
              recipe?.ingredient?.length > 0 &&
              recipe?.ingredients[i]?.quantity <= stock[i]?.availableQuantity
            ) {
              console.log("availble");
            } else {
              SetIsStocksAvailable(false);
              set_isStopLoop(true);
            }
          }
        }
      }
    }
  }, []);

  return (
    <div className="w-full h-full relative p-5 rounded-xl shadow border border-gray-100 font-montserrat pb-10">
      {/* when cooking is finished */}
      {secs == 0 ? (
        ""
      ) : (
        <>
          {/* when cooking is not finished */}
          <div
            className={`absolute right-5 -top-5 h-12 ${
              recipe.id == recipieBeignCooked ? "bg-green-300" : "bg-green-100 "
            } px-2 flex items-center justify-center`}
          >
            <p className="font-bold font-montserrat text-sm flex items-center space-x-3 text-green-800">
              <Icon icon="bi:clock-history" className="w-5 h-5" />
              {/* when cooking is in process */}
              {recipe.id == recipieBeignCooked ? (
                <span>{secs} sec</span>
              ) : (
                <>
                  {/* when recipe is not being cooked */}
                  <span>{recipe.duration} mins</span>
                </>
              )}
            </p>
          </div>
        </>
      )}

      <div className="my-10">
        <h3 className="text-4xl xl:text-5xl break-words leading-normal font-semibold font-montserrat capitalize">
          {recipe.recipeName}
        </h3>
      </div>
      <div className="flex flex-col xl:flex-row justify-between w-full">
        <div>
          {recipe?.ingredients?.map((ingredient) => (
            <div
              key={ingredient.ingredientId}
              className="flex items-center space-x-2"
            >
              <button>
                <Icon icon="carbon:add-alt" />
              </button>
              <Ingredients ingredient={ingredient} />
            </div>
          ))}
        </div>

        <div className="flex-1 py-4 flex flex-col space-y-2 absolute top-1/2 -translate-y-1/2 -right-1 ">
          {/* when dish is burnt */}
          {isBurnt ? (
            <button
              onClick={() => deleteRecipe()}
              className={`px-5  h-10 rounded-l-full text-white font-medium hover:shadow-sm flex items-center justify-center space-x-2  
             bg-gray-700 border-gray-700 hover:bg-white hover:text-gray-800 hover:border 
             
            `}
            >
              Throw it
            </button>
          ) : recipe.id == recipieBeignCooked ? (
            <>
              {/* when cooking is finished */}
              {secs == 0 ? (
                <>
                  {/* when dish is ready to eat */}
                  <button
                    onClick={() => deleteRecipe(recipe)}
                    className={`  h-10 rounded-l-full text-white   hover:shadow-sm flex items-center justify-center space-x-2   bg-blue-400  text-[17px] px-5  border-[green]  `}
                  >
                    Eat
                  </button>
                </>
              ) : (
                <button
                  className={`  h-10 rounded-l-full text-white   hover:shadow-sm flex items-center justify-center space-x-2  " bg-[green]  text-[15px] px-3   border-[green]  `}
                >
                  Cooking
                </button>
              )}
            </>
          ) : (
            <>
              {/* for start cooking */}
              <button
                onClick={() => checkIsCook(recipe)}
                className={`px-5  h-10 rounded-l-full text-white font-medium hover:shadow-sm flex items-center justify-center space-x-2  
              ${
                isStocksAvailable
                  ? "bg-rose-700 border-rose-700 hover:bg-white hover:text-rose-700 hover:border "
                  : "bg-gray-500 cursor-not-allowed hover:bg-gray-500 border-0 "
              }
              `}
              >
                Cook
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
