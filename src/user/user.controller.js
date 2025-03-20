const express = require("express");
const router = express.Router();

const userService = require("./user.services");
const prisma = require("../db");

router.post('/', async (req, res) => {
    try {
        // console.log(userService); // Debug output
        const user = req.body;
        const newUser = await userService.createUser(user);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get("/", async (req, res) => {
    try {
        const user = await userService.getAllUser()
        res.send(user)
    } catch (error) {
        res.status(500).send(error.message)
    }
    
})

router.get("/:id", async (req, res) => {
    try {
        const userId = parseInt (req.params.id)
        const user = await userService.getUserById(userId)
        res.send(user)
    } catch (error) {
        res.status(400).send(error.message)  
    }
    
})

router.patch("/:id", async (req, res) => {
    try {
        const userId = parseInt(req.params.id)
        const user = req.body
        const updateUser = await userService.editUserById(userId, user);

        delete updateUser.password;
        res.status(200).send({data: updateUser, message: "User Upadate!"})
    } catch (error) {
        res.status(400).send(error.message)
    }
    
})

router.delete("/:id", async (req, res) => {
    try {
        const userId = parseInt(req.params.id)
        await userService.deleteUserById(userId)
        res.status(200).json({message: "User Deleted"})
    } catch (error) {
        res.status(400).send(error.message)   
    }    
})


module.exports = router