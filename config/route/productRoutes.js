const express = require("express");

const { ProductModel } = require("../model/productModel");

const productRoute = express.Router();
const { authen } = require("../middleware/jwt");
const { authent } = require("../middleware/authen.js")
require("dotenv").config();


productRoute.use(authen);
productRoute.get("/", authent(["Seller", "user"]), async (req, res) => {
    try {
        let p = await ProductModel.find();
        res.send(p);
    }
    catch (err) {
        res.send(err);
    }
})

productRoute.post("/addproducts", authent(["Seller"]), async (req, res) => {
    console.log("skjdfhjkhsdbf")
    let role = req.user[0].role;
    let data = req.body;
    try {
        if (role == "Seller") {
            await ProductModel.insertMany(data);
            res.send("Product Added")
        }
        else {
            res.send("Not authorized");
        }
    }
    catch (err) {
        res.send(err);
    }
})

productRoute.delete("/deleteproducts", authent(["Seller"]), async (req, res) => {
    let id = req.query.id;
    try {
        await ProductModel.findByIdAndDelete({ "_id": id });
        res.send("product deleted");
    }
    catch (err) {
        res.send(err);
    }
})


module.exports = {
    productRoute
}