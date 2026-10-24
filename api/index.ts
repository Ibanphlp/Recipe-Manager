import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import {
    Recipe,
    getRecipesById,
    addRecipe,
    getRecipes,
    updateRecipesById,
    deleteRecipesById,
} from "./store";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(cors());

// Test if the body is valid
function isValidRecipeBody(body: unknown): body is Omit<Recipe, "id"> {
    if (typeof body !== "object" || body === null) return false;
    const b = body as Record<string, unknown>;
    return (
        typeof b.name === "string" && b.name.trim() !== "" &&
        typeof b.preparationTime === "number" && b.preparationTime >= 0 &&
        (b.difficulty === "easy" || b.difficulty === "medium" || b.difficulty === "hard") &&
        Array.isArray(b.ingredients) && b.ingredients.every((i) => typeof i === "string") &&
        typeof b.instructions === "string"
    );
}

// GET /recipes
app.get("/recipes", async (_req: Request, res: Response) => {
    res.status(200).json(await getRecipes());
});

// GET /recipes/:id
app.get("/recipes/:ID", async (req: Request, res: Response) => {
    const id = Number(req.params.ID);
    const recipe = await getRecipesById(id);

    if (recipe === undefined) {
        res.status(404).json({ error: `Recipe ${req.params.ID} not found` });
        return;
    }
    res.status(200).json(recipe);
});

// POST /recipes
app.post("/recipes", async (req: Request, res: Response) => {
    const body: unknown = req.body;

    if (!isValidRecipeBody(body)) {
        res.status(400).json({ error: "Invalid recipe body" });
        return;
    }

    const created = await addRecipe(
        body.name, body.preparationTime, body.difficulty, body.ingredients, body.instructions
    );
    if (created === undefined) {
        res.status(500).json({ error: "Could not save the recipe" });
        return;
    }

    res.status(201).json(created);
});

// PUT /recipes/:id
app.put("/recipes/:ID", async (req: Request, res: Response) => {
    const id = Number(req.params.ID);
    const body: unknown = req.body;

    if (!isValidRecipeBody(body)) {
        res.status(400).json({ error: "Invalid recipe body" });
        return;
    }

    const updated = await updateRecipesById(
        id, body.name, body.preparationTime, body.difficulty, body.ingredients, body.instructions
    );
    if (updated === undefined) {
        res.status(404).json({ error: `Recipe ${req.params.ID} not found` });
        return;
    }

    res.status(200).json(updated);
});

// DELETE /recipes/:id
app.delete("/recipes/:ID", async (req: Request, res: Response) => {
    const id = Number(req.params.ID);
    const deleted = await deleteRecipesById(id);

    if (deleted === undefined) {
        res.status(404).json({ error: `Recipe ${req.params.ID} not found` });
        return;
    }

    res.status(204).send();
});

app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});