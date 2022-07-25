import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./layout/layout";
import Home from "./pages/main-page";
import Recipes from "./pages/recipes-page";
import axios from "axios";
import { useRecoilState } from "recoil";
import { recipesState } from "./atom/recipes-atom";
import MyStock from "./pages/my-stock";
import { ingredientsStore } from "./atom/ingredient";
import { stockIngredients } from "./atom/my-stock";
import CookNow from "./pages/cook-page";
import AlertBox from "./components/AlertBox";

/**
 * ## App component
 * # In App component Router is configured with
 * # React-router
 *
 * @returns App
 */

export default function App() {
  const [recipes, setRecipes] = useRecoilState(recipesState);
  const [ingredients, setingredients] = useRecoilState(ingredientsStore);
  const [stock, setStock] = useRecoilState(stockIngredients);

  //Fetching Data and storing in Recoil(State Management Library)

  // Fetching recipes
  const fetchRecipes = async () => {
    await axios.get("http://localhost:3000/pre-recipes").then((res) => {
      setRecipes(res.data);
    });
  };

  // Fetching Ingredients
  const fetchIngredientsStore = async () => {
    await axios.get("http://localhost:3000/ingredients").then((res) => {
      setingredients(res.data);
    });
  };

  // Fetching Stocks/Fridge
  const fetchStockIngredients = async () => {
    await axios.get("http://localhost:3000/fridge").then((res) => {
      setStock(res.data);
    });
  };

  useEffect(() => {
    fetchRecipes();
    fetchIngredientsStore();
    fetchStockIngredients();
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="my-stock" element={<MyStock />} />
          <Route path="cook-now" element={<CookNow />} />
        </Route>
      </Routes>
    </>
  );
}
