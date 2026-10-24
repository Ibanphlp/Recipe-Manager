import { promises as fs } from 'fs';
import path from 'path';

export const filePath = path.join(__dirname, 'recipes.json');

export interface Recipe {
    id: number;
    name: string;
    preparationTime: number;
    difficulty: "easy" | "medium" | "hard";
    ingredients: string[];
    instructions: string;
}


// +----------------------------------------------------------------------------------+
// |                     GET method to find a recipes on the json                     |
// +----------------------------------------------------------------------------------+

// La fonction retourne une Promesse contenant un tableau de Recipe
export async function getRecipesById(id: number): Promise<Recipe | undefined> {
  try {
    const rawData = await fs.readFile(filePath, 'utf-8');

    const recipes: Recipe[] = rawData ? JSON.parse(rawData) : [];

    // ERROR CASE: if there are no recipes saved
    if (recipes.length === 0) {
        console.log(`Il n'y a aucune recette enregistrée.`);
        return undefined;        
    }

    // trouver le dictionnaire dont d'id est egal a celui en parametre
    const foundRecipe = recipes.find((element) => element.id === id);

    // ERROR CASE: if there is no recipe with the id passed in parameters
    if (foundRecipe == undefined) {
        console.log(`La recette avec l'id ${id} n'existe pas.`);
        return undefined;
    }

    return foundRecipe;
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier JSON:', error);
    return undefined; // Retourne un tableau vide en cas d'erreur (fichier inexistant, etc.)
  }
}

// +---------------------------------------------------------------------------------+
// |                    POST method to add a recipes to the json                     |
// +---------------------------------------------------------------------------------+

// LEGACY: Generate a random id between 1 and 50 000 000 (very very very very bad)
//export function generateId() {
//    return Math.floor((Math.random() * 50000000) + 1);
//}


async function getBiggestID(): Promise<number> {

  const rawData = await fs.readFile(filePath, 'utf-8');

  // Si le fichier est vide, on initialise un tableau vide
  const recipes: Recipe[] = rawData ? JSON.parse(rawData) : [];

  // ERROR CASE: if there are no recipes saved
  if (recipes.length === 0) {
    console.log(`Il n'y a aucune recette enregistrée.`);
    return 0;        
  }

  // fetch all the id (and ONLY them) then case them in foundIds
  let foundIds = recipes.map(recipe => recipe.id);

  console.log(`All IDs: ${foundIds}`);

  // using spread operator to remove the [] and just get the numbers seperated by comas
  let biggestId = Math.max(...foundIds);

  return biggestId;
}

export async function addRecipe(
    name: string, 
    preparationTime: number, 
    difficulty: "easy" | "medium" | "hard", 
    ingredients: string[], 
    instructions: string
) {
  try {
    const rawData = await fs.readFile(filePath, 'utf-8');

    // Si le fichier est vide, on initialise un tableau vide
    const recipes: Recipe[] = rawData ? JSON.parse(rawData) : [];

    if (typeof await getBiggestID() === "undefined") {
      console.log("L'id est undefined");
    }

    const id: number = await getBiggestID() + 1;

    // Create a new recipe object
    const newRecipe: Recipe = {
        id,
        name,
        preparationTime,
        difficulty,
        ingredients,
        instructions
    };

    // Add this recipe to the json
    recipes.push(newRecipe);

    // Convert the tab to json
    const updatedData = JSON.stringify(recipes, null, 2);

    // Write the updated data
    await fs.writeFile(filePath, updatedData, 'utf-8');
    console.log(`La recette "${name}" a été ajoutée avec succès !`);
    return newRecipe;                 


  } catch (error) {
    console.error('Erreur lors de la manipulation du fichier JSON:', error);
    return undefined;
  }
}

// +------------------------------------------------------------------------------------------+
// |                    GET method to fetch all the recipes from the json                     |
// +------------------------------------------------------------------------------------------+


// La fonction retourne une Promesse contenant un tableau de Recipe
export async function getRecipes(): Promise<Recipe[]> {
  try {
    const rawData = await fs.readFile(filePath, 'utf-8');

    const recipes: Recipe[] = rawData ? JSON.parse(rawData) : [];

    return recipes;

  } catch (error) {
    console.error('Erreur lors de la lecture du fichier JSON:', error);
    return []; // Retourne un tableau vide en cas d'erreur (fichier inexistant, etc.)
  }
}

// +---------------------------------------------------------------------------------+
// |                    PUT method to update a recipes by its id                     |
// +---------------------------------------------------------------------------------+


export async function updateRecipesById(    
    id: number,
    name: string, 
    preparationTime: number, 
    difficulty: "easy" | "medium" | "hard", 
    ingredients: string[], 
    instructions: string): Promise<Recipe | undefined> {
  try {
    // Create a new recipe object to replace the current one according to its id
    const newRecipe: Recipe = {
        id,
        name,
        preparationTime,
        difficulty,
        ingredients,
        instructions
    };
    const rawData = await fs.readFile(filePath, 'utf-8');
    const recipes: Recipe[] = rawData ? JSON.parse(rawData) : [];
    let foundRecipe: number = 0;

    // find the existant recipe we want to update 
    let currentRecipe = recipes.find((element) => element.id === id);

    // replace the old recipe with the new one
    currentRecipe = newRecipe;

    // delete the object whose id is the id in parameters
    //recipes.filter(recipe => recipe.id === id);
    for (let [i, recipe] of recipes.entries()) {
      if (recipe.id === id) {
        recipes.splice(i, 1); // The object is now removed from "recipes" bacause id
        foundRecipe += 1;
      }
    }
    // If no recipe contain this id, stop the function and do nothing else
    if (foundRecipe < 1) {
      console.log("Aucune recette n'a cet ID")
      return undefined;
    }

    // Add the new recipe to the json (which replace the old one)
    recipes.push(newRecipe);

    // Convert the tab to json
    const updatedData = JSON.stringify(recipes, null, 2);

    // Write the updated data
    await fs.writeFile(filePath, updatedData, 'utf-8');
    console.log(`La recette "${name}" a été updatée avec succès !`);

    return newRecipe;

  } catch (error) {
    console.error('Erreur lors de la lecture du fichier JSON:', error);
    return undefined;
  }
}

// +------------------------------------------------------------------------------------+
// |                    DELETE method to delete a recipes by its id                     |
// +------------------------------------------------------------------------------------+


export async function deleteRecipesById(id: number): Promise<Recipe | undefined> {
  try {
    const rawData = await fs.readFile(filePath, 'utf-8');
    const recipes: Recipe[] = rawData ? JSON.parse(rawData) : [];
    let foundRecipe: number = 0;

    // find the existant recipe we want to update 
    let currentRecipe = recipes.find((element) => element.id === id);

    // delete the object whose id is the id in parameters
    for (let [i, recipe] of recipes.entries()) {
      if (recipe.id === id) {
        recipes.splice(i, 1); // The object is now removed from "recipes" bacause id
        foundRecipe += 1;
      }
    }
    // If no recipe contain this id, stop the function and do nothing else
    if (foundRecipe < 1) {
      console.log("Aucune recette n'a cet ID")
      return undefined;
    }

    // Convert the tab to json
    const updatedData = JSON.stringify(recipes, null, 2);

    // Write the updated data
    await fs.writeFile(filePath, updatedData, 'utf-8');
    console.log(`La recette avec id "${id}" a été supprimée avec succès !`);

    return currentRecipe;

  } catch (error) {
    console.error('Erreur lors de la lecture du fichier JSON:', error);
    return undefined;
  }
}