const express = require("express");
require("dotenv").config();
const { connection } = require("./config/db")
const { userRoute } = require("./config/route/userRoute");
const { productRoute } = require("./config/route/productRoutes");
const app = express();
app.use(express.json());
app.use("/user", userRoute);
app.use("/products", productRoute);


app.listen(process.env.port, async () => {
    try {
        await connection;
        console.log("Successfully connected to database");
    }
    catch (err) {
        console.log(err);
    }
    console.log(`Server is running on port ${process.env.port}`)
})