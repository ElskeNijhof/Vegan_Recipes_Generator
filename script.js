const apiKey = "f7d94298adc4422cb1f2ea70b1e236e2";

function getRecipes() {
  const ingredients = document.getElementById("ingredientsInput").value;
  const excl_ingredients = document.getElementById("excludeInput").value;
  const url = `https://api.spoonacular.com/recipes/complexSearch?diet=vegan&includeIngredients=${encodeURIComponent(ingredients)}&excludeIngredients=${encodeURIComponent(excl_ingredients)}&number=10&addRecipeInformation=true&apiKey=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const recipesDiv = document.getElementById("recipes");
      recipesDiv.innerHTML = "";

      if (data.results.length === 0) {
        recipesDiv.innerHTML = "<p>No recipes found. Try different ingredients.</p>";
        return;
      }


    // Filtered functie aanroepen en 'oven' als input geven
    filterOutRecipesWithUnwantedEquipment(data.results, ["oven"]).then(filteredRecipes => {
    if (filteredRecipes.length === 0) {
        recipesDiv.innerHTML = "<p>No recipes matched the filter (oven excluded).</p>";
        return;
    }

    filteredRecipes.forEach(recipe => {
        const recipeHTML = `
        <div class="recipe">
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}" />
            <p><a href="${recipe.sourceUrl}" target="_blank">View Full Recipe</a></p>
        </div>
        `;
        recipesDiv.innerHTML += recipeHTML;
    });
    });
})
 // Checkt of er recepten gevonden worden of niet. 
    .catch(error => {
        console.error("Error fetching recipes:", error);
        document.getElementById("recipes").innerHTML = "<p>Something went wrong.</p>";
    });
}

// async functie definieren om recepten met een oven weg te filteren.
async function filterOutRecipesWithUnwantedEquipment(recipes, excludedEquipmentList) {
  const filteredRecipes = [];

  for (const recipe of recipes) {
    const equipmentUrl = `https://api.spoonacular.com/recipes/${recipe.id}/equipmentWidget.json?apiKey=${apiKey}`;
    
    try {
      const response = await fetch(equipmentUrl);
      const data = await response.json();
      const toolsUsed = data.equipment.map(eq => eq.name.toLowerCase());

      const hasExcludedTool = excludedEquipmentList.some(tool =>
        toolsUsed.includes(tool.toLowerCase())
      );

      if (!hasExcludedTool) {
        filteredRecipes.push(recipe);
      }
    } catch (error) {
      console.error(`Error checking equipment for recipe ${recipe.id}`, error);
    }
  }

  return filteredRecipes;
}