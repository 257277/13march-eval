const express = require("express");
require("dotenv").config();
const { UserModel } = require("../model/userModel");
const { hashing } = require("../middleware/bcrypt");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { BlackModel } = require("../model/blackModel")
const userRoute = express.Router();

userRoute.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.find({ email });
        if (!user) {
            res.send("wrong Credential");
        }
        const passMatch = bcrypt.compare(password, user[0].password)
        if (!passMatch) {
            res.send("wrong Credential");
        }
        let token = jwt.sign({ userid: user[0]._id }, process.env.privateKey,
            {
                expiresIn: 60
            });
        let refreshtoken = jwt.sign({ userid: user[0]._id }, process.env.refreshPrivateKey,
            {
                expiresIn: 300
            });
        res.send({ "msg": "login done!", "token": token, "refrehtoken": refreshtoken });
    }
    catch (err) {
        console.log(err);
        res.send("Try Again!")
    }
})

userRoute.post("/refrehToken", async (req, res) => {
    const refresh_token = req.headers.authorization;
    if (!refresh_token) {
        res.send("Login Again!")
    }
    jwt.verify(refresh_token, process.env.refreshPrivateKey, function (err, decoded) {
        if (err) {
            res.send("Login First", err);
        }
        else {

            let token = jwt.sign({ userid: decoded.userid }, process.env.privateKey,
                {
                    expiresIn: 60
                });
            res.send({ "msg": "login done!", "token": token });
        }
    });
})


userRoute.post("/logout", async (req, res) => {
    let token = req.headers.authorization;
    try {
        await BlackModel.insertMany({ "token": token });

        res.send("Successfully logout");
    }
    catch (err) {
        res.send(err);
    }
})


userRoute.use(hashing)
userRoute.post("/register", async (req, res) => {
    try {
        const user = await UserModel.insertMany(req.body);
        res.send("successfully registered");
    }
    catch (err) {
        res.send(err);
    }
})

module.exports = {
    userRoute
}