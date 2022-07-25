import React from "react";
import { useRecoilState } from "recoil";
import { recipesState } from "../atom/recipes-atom";
import CookRecipeCard from "../components/cook-recipe-card";

export default function CookNow() {
  const [recipes, setRecipes] = useRecoilState(recipesState);
  return (
    <div className="pt-10 px-5 md:px-10 2xl:container 2xl:mx-auto 2xl:px-0 relative min-h-screen">
      <h2 className="text-center font-cormorant text-5xl font-semibold">
        Cook Your Favourite Recipe
      </h2>
      <div className="grid grid-cols-1 py-20 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {recipes?.map((recipe) => (
          <CookRecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
