const jwt = require('jsonwebtoken');
require("dotenv").config();
const { UserModel } = require("../model/userModel");
const { BlackModel } = require("../model/blackModel")
const authen = async (req, res, next) => {
    const token = req.headers.authorization;
    try {
        let blacklist = await BlackModel.find({ "token": token });

        if (!blacklist) {
            res.send("Login first");
        }

        let decoded = jwt.verify(token, process.env.privateKey);
        let userId = decoded.userid;
        const user = await UserModel.find({ "_id": userId });
        if (!user) {
            res.send("Not authorized");
        }
        req.user = user;
        next();

    }
    catch (err) {
        res.send(err);
    }
}


module.exports = {
    authen
}