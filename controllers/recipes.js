const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe");
const Ingredient = require("../models/ingredient");

router.get("/", async (req, res) => {
    try {
        const recipes = await Recipe.find({ owner: req.session.user._id }).populate("ingredients");
        res.render("recipes/index", { recipes });
    } catch (error) {
        console.error(error);
        res.redirect("/");
    }
});

router.get("/new", async (req, res) => {
    try {
        const ingredients = await Ingredient.find();
        res.render("recipes/new", { ingredients });
    } catch (error) {
        console.error(error);
        res.redirect("/recipes");
    }
});

router.post("/", async (req, res) => {
    try {
        const newRecipe = new Recipe({
            name: req.body.name,
            instructions: req.body.instructions,
            owner: req.session.user._id,
            ingredients: Array.isArray(req.body.ingredients) ? req.body.ingredients : [req.body.ingredients],
        });

        await newRecipe.save();
        res.redirect("/recipes");
    } catch (error) {
        console.error(error);
        res.redirect("/");
    }
});

router.get("/:recipeId", async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId).populate("ingredients");
        res.render("recipes/show", { recipe });
    } catch (error) {
        console.error(error);
        res.redirect("/recipes");
    }
});

router.get("/:recipeId/edit", async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);
        const ingredients = await Ingredient.find();

        if (!recipe) return res.status(404).send("Recipe not found");

        res.render("recipes/edit", { recipe, ingredients });
    } catch (error) {
        console.error(error);
        res.redirect("/recipes");
    }
});

router.put("/:recipeId", async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);
        if (!recipe.owner.equals(req.session.user._id)) return res.redirect("/recipes");

        recipe.name = req.body.name;
        recipe.instructions = req.body.instructions;
        recipe.ingredients = Array.isArray(req.body.ingredients) ? req.body.ingredients : [req.body.ingredients];

        await recipe.save();
        res.redirect(`/recipes/${recipe._id}`);
    } catch (error) {
        console.error(error);
        res.redirect("/recipes");
    }
});

router.delete("/:recipeId", async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);
        if (!recipe.owner.equals(req.session.user._id)) return res.redirect("/recipes");

        await recipe.deleteOne();
        res.redirect("/recipes");
    } catch (error) {
        console.error(error);
        res.redirect("/recipes");
    }
});

module.exports = router;