import { useEffect, useState } from 'react'
import Details from './Details';
import {fetchRecipeDetails} from './api'
import { Link, useParams } from 'react-router'


const API_URL = "http://localhost:3000";

export function Modify() {
    const { id } = useParams()
    const [name, setName] = useState<string>("");
    const [preparationTime, setPreparationTime] = useState<number | "">("");
    const [difficulty, setDifficulty] = useState<string>("");
    const [ingredients, setIngredients] = useState<string[]>([""]);
    const [instructions, setInstructions] = useState<string>("");

    useEffect(() => {
        if (!id) return;

        async function loadRecipe(recipeId: string) {
            try {
                const jsonData = await fetchRecipeDetails(recipeId);
                setName(jsonData.name);
                setPreparationTime(jsonData.preparationTime);
                setDifficulty(jsonData.difficulty);
                setIngredients(jsonData.ingredients);
                setInstructions(jsonData.instructions);
            } catch (error) {
                console.error("Échec du chargement de la recette", error);
            }
        }

        loadRecipe(id);
    }, [id]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            const response = await fetch(`${API_URL}/recipes/${id}`, {
                method: "PUT", // la méthode (POST, GET etc)
                headers: { "Content-Type": "application/json" }, // le header du json
                body: JSON.stringify({ name, preparationTime, difficulty, ingredients, instructions }), // le format du json
            });

            const data = await response.json();
            console.log("Réponse du serveur :", data); // afficher le json renvoyé par le serveur

            alert("The recipe has been updated successfully !")
            window.location.href = "/";
            console.log("Envoyé !");
            // Reset tout les truc du form
            setName("");
            setPreparationTime("");
            setDifficulty("");
            setIngredients([""]);
            setInstructions("");
        } catch (error) {
            console.error(error);
            console.log("Échec de l'envoi");
        }
    }

  return (
    <>
    <Link className="top-btn" to="/"><i id="i" className="f7-icons">chevron_left</i>Back</Link>
    <form onSubmit={handleSubmit} id="recipe-form">
          <label>Recipe name:</label>
          <input type="text" id="recipe-name" name="name" required value={name} onChange={e => setName(e.target.value)} />

          <label>Preparation time (min):</label>
          <input
              type="number"
              id="preparation-time"
              name="preparation_time"
              min="0"
              max="200"
              required
              value={preparationTime}
              onChange={e => setPreparationTime(e.target.value === "" ? "" : Number(e.target.value))} />

          <label>Difficulty:</label>
          <select id="difficulty" name="difficulty" required value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="">-- Choose a difficulty --</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
          </select>

          <fieldset>
              <legend>Ingredients:</legend>
              <div id="ingredients-list">
                {ingredients.map((ingredient, index) => (
                <input
                    key={index}
                    type="text"
                    name="ingredients"
                    placeholder="e.g. 200g flour"
                    value={ingredient}
                    onChange={e => {
                        const newIngredients = [...ingredients];
                        newIngredients[index] = e.target.value;
                        setIngredients(newIngredients);
                    }}
                />
                ))}
              </div>
            <button
                type="button"
                id="add-ingredient"
                onClick={() => setIngredients([...ingredients, ""])}
            >
                + ADD
            </button>
          </fieldset>

          <label>Instructions:</label>
          <textarea
              id="instructions"
              name="instructions"
              maxLength={5000} 
              placeholder="Type the instructions here..."
              required
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
          ></textarea>

          <button type="submit">Submit</button>
      </form>
      </>
  )
}

export default Modify