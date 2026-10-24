import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { fetchRecipes, type RecipeCard } from './api'
import './App.css'

function App() {
  const [recipes, setRecipes] = useState<RecipeCard[]>([])

  useEffect(() => {
    fetchRecipes().then(setRecipes)
  }, [])

  return (
    <>
    <h2 className="main-title">Recipe Manager</h2>
    <p className="top-p">Welcome to your recipe manager! Easily add, view, edit, and delete recipes, all in one place.</p>
    <a id="add" className="top-btn" href="/add"><i id="i" className="f7-icons">plus</i>Add a recipe</a>
    <h3 className="main-title">All recipes</h3>
    <div className="cards">
      {recipes.map((r) => (
        <Link to={`/details/${r.id}`}>
        <div className="card" key={r.id}>
          <h3>{r.name}</h3>
          <p>{r.difficulty}</p>
          <p>{r.preparationTime} min</p>
        </div>
        </Link>
      ))}
    </div>
    <footer>
        <p>Made using React, CSS and TypeScript</p>
        <p>© 2026 Iban Philippe - All right reserved.</p>
    </footer>
    </>
  )
}

export default App