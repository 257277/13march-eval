const authent = (role) => {
    return (req, res, next) => {

        let user_role = `${req.user[0].role}`;
        console.log("userRole", user_role);
        if (role.includes(user_role)) {
            next();
        }
        else {
            res.send("You are not authorized");
        }
    }
}


module.exports = {
    authent
}