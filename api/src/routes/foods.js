const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const { Food, Menu, Score, User, Feedback, conn } = require('../db.js');
const { isUser, isAdmin } = require("../middleware/auth.js");


router.get('/', async (req, res) => {
    const { name = '', filter = '', price = '', vegetarian = '' } = req.query;
    try {
        let foods = await Food.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${name}%`
                },
                drinkable: {
                    [Op.or]: filter === 'drink' ? [true] : filter === 'food' ? [false] : [true, false]
                },
                vegetarian: {
                    [Op.or]: vegetarian === 'true' ? [true] : [true, false]
                }
            },
            include: [{
                model: Menu
            }],
            order: [
                price.toUpperCase() === "ASC" || price.toUpperCase() === "DESC" ? ['price', price.toUpperCase()] : ['id', 'DESC']
            ]
        });
        return res.status(201).send(foods);
    } catch (err) {
        return res.status(400).json("error " + err.message)
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const food = await Food.findByPk(id,
            {
                include: [
                    {
                        model: Menu,
                        attributes: ['name']
                    },
                    {
                        model: Score,
                        attributes: ['stars']
                    },
                    {
                        model: Feedback,
                        include: {
                            model: User,
                            attribute: ['user', 'photo']
                        }
                    }
                ],
                order: [
                    [Menu, 'name', 'ASC'],
                    [Feedback, 'id', 'DESC']
                ],
            });
        if (food) return res.status(201).send({
            id: food.id,
            name: food.name,
            photo: food.photo,
            summary: food.summary,
            price: food.price,
            drinkable: food.drinkable,
            vegetarian: food.vegetarian,
            menus: food.menus.map(menu => menu.name),
            stars: food.scores.length ? food.scores.reduce((prev, curr) => prev + curr.stars, 0) / food.scores.length : 0,
            comments: food.feedbacks.length ? food.feedbacks.map(f => { return {id: f.id, name: f.user.user, photo: f.user.photo, comment: f.comment, time: f.time} }) : []
        });
        else return res.status(201).send(food);
    } catch (err) {
        return res.status(400).json("error " + err.message)
    }
});

router.post('/', isAdmin, async (req, res) => {          // crear comida
    const { name, photo, summary, price, stock, menu, drinkable, vegetarian } = req.body;
    console.log(req.body)
    try {
        findname = await Food.findOne({
            where: {
                name: name
            }
        });
        if (findname) {
            return res.status(400).send("Food already exists");
        }
        let food = await Food.create({
            name,
            photo,
            summary,
            price,
            stock,
            vegetarian,
            drinkable: false || drinkable,
        });
        menu?.map(async (m) => {
            let meenu = await Menu.findOne({
                where: {
                    name: m
                }
            });
            food.addMenu(meenu);
        })
        res.status(201).send("Food created");
    } catch (error) {

        return res.status(400).json("error " + error.message)
    }
});



router.post('/tomenu', isAdmin, async (req, res) => {  // Agrega comidas existentes a menus existentes
    const { food, menu } = req.body;
    console.log(req.body)
    try {
        let meenu = await Menu.findOne({
            where: {
                name: menu
            }
        });
        let foood = await Food.findOne({
            where: {
                name: food
            }
        });
        meenu.addFood(foood);
        res.status(201).send("Food added");
    } catch (error) {
        return res.status(400).json("error " + error.message)
    }
});
router.put("/:id", isAdmin, async (req, res) => {  // modificar comida
    const { id } = req.params;
    const { name, photo, summary, price, stock, drinkable, vegetarian } = req.body;
    try {
        await Food.update({
            name,
            summary,
            price,
            photo
        }, {
            where: {
                id: id
            }
        });
        res.json("food modificada")
    } catch (e) {
        return res.status(404).json("error " + e.message)
    }
});

router.delete("/:id", isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await Food.destroy({
            where: {
                id: id
            }
        });
        res.json("food borrada");
    } catch (e) {
        return res.status(404).json("error " + e.message);
    }
})

router.post('/score/:id', isUser, async (req, res) => {          // dar score
    const { id: foodId = 0 } = req.params;
    const { user: userId = 0, valoration: stars = 0 } = req.query;

    try {
        const feedback = await Score.findOne({
            where: {
                userId,
                foodId
            }
        });
        if (feedback) {
            await Score.update(
                {
                    stars
                },
                {
                    where: {
                        userId,
                        foodId
                    }
                });
            return res.status(201).send("La valoración fue cambiada");
        }
        await Score.create({
            userId,
            foodId,
            stars
        });
        res.status(201).send("La valoración fue enviada");
    } catch (err) {
        return res.status(400).json("error " + err.message)
    }
});

router.post('/comment/:id', isUser, async (req, res) => {          // crear feedback
    const { id: foodId = 0 } = req.params;
    const { user: userId = 0 } = req.query;
    const { comment, time } = req.body;

    try {
        await Feedback.create({
            userId,
            foodId,
            comment,
            time
        });
        res.status(201).send("La comentario fue agregado");
    } catch (err) {
        return res.status(400).json("error " + err.message)
    }
});


module.exports = router;