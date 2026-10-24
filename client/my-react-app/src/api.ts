import { Link, useParams } from 'react-router'

const API_URL = 'http://localhost:3000/recipes'

export interface RecipeCard {
  id: number
  name: string
  preparationTime: number
  difficulty: string
}

export interface RecipeDetails {
  id: number
  name: string
  preparationTime: number
  difficulty: 'easy' | 'medium' | 'hard'
  ingredients: string[]
  instructions: string
}

export async function fetchRecipes(): Promise<RecipeCard[]> {
  const res = await fetch(API_URL)
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)
  return res.json()
}

export async function fetchRecipeDetails(id: string): Promise<RecipeDetails> {
  const res = await fetch(`${API_URL}/${id}`)
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)
  return res.json()
}

