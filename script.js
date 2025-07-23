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

      data.results.forEach(recipe => {
        const recipeHTML = `
          <div class="recipe">
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}" />
            <p><a href="${recipe.sourceUrl}" target="_blank">View Full Recipe</a></p>
          </div>
        `;
        recipesDiv.innerHTML += recipeHTML;
      });
    })
    .catch(error => {
      console.error("Error fetching recipes:", error);
      document.getElementById("recipes").innerHTML = "<p>Something went wrong.</p>";
    });
}