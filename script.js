const searchBox = document.querySelector(".searchBox");
const btn = document.querySelector(".btn");
const recipecontainer = document.querySelector(".recipe-container");
const recipeContent = document.querySelector(".recipe-content");
const closeBtn = document.querySelector(".recipe-close-btn");

// function to get recipes
const fecthRecipes = async (query) => {
  recipecontainer.innerHTML = "Fetching recipes...";
  try {
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();
    recipecontainer.innerHTML = "";

    if (!response.meals) {
      recipecontainer.innerHTML = "<p>No recipes found!</p>";
      return;
    }

    response.meals.forEach(meal => {
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe");

      recipeDiv.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>${meal.strMeal}</h3>
        <p>${meal.strArea}</p>
        <p>${meal.strCategory}</p>
      `;

      const button = document.createElement("button");
      button.textContent = "View Recipe";
      recipeDiv.appendChild(button);

      button.addEventListener("click", () => {
        openRecipePopup(meal);
      });

      recipecontainer.appendChild(recipeDiv);
    });

  } catch (error) {
    recipecontainer.innerHTML = "<p>Error fetching recipes!</p>";
    console.error(error);
  }
};

// function to fetch ingredients and measurement
const fetchIngredietents = (meal) => {
  let IngredeintsList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredeints = meal[`strIngredient${i}`];
    if (ingredeints) {
      const measure = meal[`strMeasure${i}`];
      IngredeintsList += `<li>${measure} ${ingredeints}</li>`;
    } else {
      break;
    }
  }
  return IngredeintsList;
};

// ✅ ONLY CHANGE HERE (video link added)
const openRecipePopup = (meal) => {
  recipeContent.innerHTML = `
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul class="IngredeintsList">${fetchIngredietents(meal)}</ul>

    <div class="instruction">
      <h3>Instructions:</h3>
      <p>${meal.strInstructions}</p>
    </div>

    ${
      meal.strYoutube
        ? `<p><a href="${meal.strYoutube}" target="_blank">▶️ Watch Recipe Video</a></p>`
        : ""
    }
  `;

  recipeContent.parentElement.style.display = "block";
};

closeBtn.addEventListener("click", () => {
  recipeContent.parentElement.style.display = "none";
});

btn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();
  if (searchInput) fecthRecipes(searchInput);
});