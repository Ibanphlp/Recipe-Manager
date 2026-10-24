"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const store_1 = require("./store");
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Test if the body is valid
function isValidRecipeBody(body) {
    if (typeof body !== "object" || body === null)
        return false;
    const b = body;
    return (typeof b.name === "string" && b.name.trim() !== "" &&
        typeof b.preparationTime === "number" && b.preparationTime >= 0 &&
        (b.difficulty === "easy" || b.difficulty === "medium" || b.difficulty === "hard") &&
        Array.isArray(b.ingredients) && b.ingredients.every((i) => typeof i === "string") &&
        typeof b.instructions === "string");
}
// GET /recipes
app.get("/recipes", async (_req, res) => {
    res.status(200).json(await (0, store_1.getRecipes)());
});
// GET /recipes/:id
app.get("/recipes/:ID", async (req, res) => {
    const id = Number(req.params.ID);
    const recipe = await (0, store_1.getRecipesById)(id);
    if (recipe === undefined) {
        res.status(404).json({ error: `Recipe ${req.params.ID} not found` });
        return;
    }
    res.status(200).json(recipe);
});
// POST /recipes
app.post("/recipes", async (req, res) => {
    const body = req.body;
    if (!isValidRecipeBody(body)) {
        res.status(400).json({ error: "Invalid recipe body" });
        return;
    }
    const created = await (0, store_1.addRecipe)(body.name, body.preparationTime, body.difficulty, body.ingredients, body.instructions);
    if (created === undefined) {
        res.status(500).json({ error: "Could not save the recipe" });
        return;
    }
    res.status(201).json(created);
});
// PUT /recipes/:id
app.put("/recipes/:ID", async (req, res) => {
    const id = Number(req.params.ID);
    const body = req.body;
    if (!isValidRecipeBody(body)) {
        res.status(400).json({ error: "Invalid recipe body" });
        return;
    }
    const updated = await (0, store_1.updateRecipesById)(id, body.name, body.preparationTime, body.difficulty, body.ingredients, body.instructions);
    if (updated === undefined) {
        res.status(404).json({ error: `Recipe ${req.params.ID} not found` });
        return;
    }
    res.status(200).json(updated);
});
// DELETE /recipes/:id
app.delete("/recipes/:ID", async (req, res) => {
    const id = Number(req.params.ID);
    const deleted = await (0, store_1.deleteRecipesById)(id);
    if (deleted === undefined) {
        res.status(404).json({ error: `Recipe ${req.params.ID} not found` });
        return;
    }
    res.status(204).send();
});
app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});
