import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { fetchRecipeDetails, type RecipeDetails } from './api'

const API_URL = "http://localhost:3000/recipes";

export function Details() {
  const { id } = useParams()
  const [recipe, setRecipe] = useState<RecipeDetails | null>(null)

  useEffect(() => {
    if (id) fetchRecipeDetails(id).then(setRecipe)
  }, [id])

  if (!recipe) return <p>Chargement…</p>


async function deleteRecipe() {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression");
    }

    console.log("Recette supprimée !");
  } catch (error) {
    console.error(error);
    console.log("Échec de la suppression");
  }
}
function confirmationAlert() {
  let text = "Are you sure you want to delete this recipe?\nThis action is irreversible.";
  if (confirm(text) == true) {
    deleteRecipe();
    window.location.href = "/";
  }
}

  return (
    <div>
      <div className="top-btn-container">
        <Link className="top-btn" to="/"><i id="i" className="f7-icons">chevron_left</i>Back</Link>
        <br></br>
        <br></br>
        <Link className="top-btn" to={`/modify/${id}`}><i id="i" className="f7-icons">pencil</i>Edit this recipe</Link>      
        <br></br>
        <br></br>
        <button id="delete" onClick={confirmationAlert}><i id="i" className="f7-icons">trash</i>Delete this recipe</button>   
      </div>   
      <h3>{recipe.name}</h3>
      <p>Difficulty: {recipe.difficulty}</p>
      <p>Preparation time: {recipe.preparationTime} min</p>
      <h4>Ingredients</h4>
      <ul>
        {recipe.ingredients.map((ingredient, i) => (
          <li key={i}>{ingredient}</li>
        ))}
      </ul>
      <h4>Instructions</h4>
      <p>{recipe.instructions}</p>
    </div>
  )
}

export default Details