const express = require("express");
const router = express.Router();
const Ingredient = require("../models/ingredient");

router.get("/", async (req, res) => {
    try {
        const ingredients = await Ingredient.find();
        res.render("ingredients/index", { ingredients });
    } catch (error) {
        console.error(error);
        res.redirect("/");
    }
});

router.get("/new", (req, res) => {
    res.render("ingredients/new");
});

router.post("/", async (req, res) => {
    try {
        const newIngredient = new Ingredient({ name: req.body.name });
        await newIngredient.save();
        res.redirect("/ingredients");
    } catch (error) {
        console.error(error);
        res.redirect("/");
    }
});

router.get("/:ingredientId", async (req, res) => {
    try {
        const ingredient = await Ingredient.findById(req.params.ingredientId);
        res.render("ingredients/show", { ingredient });
    } catch (error) {
        console.error(error);
        res.redirect("/ingredients");
    }
});

router.get("/:ingredientId/edit", async (req, res) => {
    try {
        const ingredient = await Ingredient.findById(req.params.ingredientId);
        res.render("ingredients/edit", { ingredient });
    } catch (error) {
        console.error(error);
        res.redirect("/ingredients");
    }
});

router.put("/:ingredientId", async (req, res) => {
    try {
        await Ingredient.findByIdAndUpdate(req.params.ingredientId, { name: req.body.name });
        res.redirect("/ingredients");
    } catch (error) {
        console.error(error);
        res.redirect("/ingredients");
    }
});

router.delete("/:ingredientId", async (req, res) => {
    try {
        await Ingredient.findByIdAndDelete(req.params.ingredientId);
        res.redirect("/ingredients");
    } catch (error) {
        console.error(error);
        res.redirect("/ingredients");
    }
});

module.exports = router;