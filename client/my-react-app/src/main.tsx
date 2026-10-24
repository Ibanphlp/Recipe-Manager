import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import Details from './Details.tsx'
import Add from './Add.tsx'
import Modify from './Modify.tsx'

import { BrowserRouter, Routes, Route } from "react-router";

const rootElement = document.getElementById('root')
if (rootElement === null) {
  throw new Error("Element #root introuvable dans le DOM")
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/add" element={<Add />} />
        <Route path="/modify/:id" element={<Modify />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)