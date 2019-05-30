let express = require("express");
let app = express();
let bodyparser = require("body-parser");
let mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/user', { useNewUrlParser: true });

// using body parser to convert req.body to object
app.use(bodyparser.urlencoded({ extended: true }));

// express only uses views folder to specify another folder like public use express.static
app.use(express.static("public"));

let userSchema = new mongoose.Schema({
    name: String,
    email: String,
    credits: Number
})

let User = mongoose.model("user", userSchema);

app.get("/", function (req, res) {
    res.render("index.ejs");
})

app.get("/user/:name", function (req, res) {
    // getting the name of first user which was passed in he url
    let searchkey = req.params.name;

    // finding the information about all users from the database
    User.find({}, function (err, response) {
        if (err) {
            console.log(err);
        }
        else {
            // finding information about the first user from the database
            User.find({ name: searchkey }, function (error, respon) {
                if (error) {
                    console.log(error);
                }
                else {
                    // rendering the single user page and passing info oa the selected user
                    // as well as all the users
                    res.render("singleuser.ejs", { result: response, firstuser: respon });
                }
            })
        }
    });
})


app.get("/users", function (req, res) {
    // finding the information about all users from the database
    User.find({}, function (err, response) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("users.ejs", { result: response });

        }

    })
})

app.get("/user/:user1/:user2", function (req, res) {
    let user1 = req.params.user1;
    let user2 = req.params.user2;
    // finding the information about first user from the database\
    User.find({ name: user1 }, function (error, respon) {
        if (error) {
            console.log(error);
        }
        else {
           // finding the information about second user from the database
            User.find({ name: user2 }, function (err, response) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.render("transfer.ejs", { firstuser: respon, seconduser: response });
                }
            })
        }
    })
})


app.post("/transfer", function (req, res) {
    let newuser1credits, newuser2credits;
    // finding the information about first user from the database
    User.find({ name: req.body.user1 }, function (err, response) {
        if (err) {
            console.log(err)
        }
        else {
            // calculating new credits for the first user
            // havent updated it yet just calculated
            newuser1credits = parseInt(response[0].credits, 10) - parseInt(req.body.credits, 10);

            // finding the information about second user from the database
            User.find({ name: req.body.user2 }, function (err, response) {
                if (err) {
                    console.log(err)
                }
                else {
            // similarly calculating new credits for the second user
                    newuser2credits = parseInt(response[0].credits, 10) + parseInt(req.body.credits, 10);

                    // updating credits of the first user by newuser1credits
                    User.updateOne({ name: req.body.user1 }, { $set: { credits: newuser1credits } }, function (errr, re) {
                        if (errr) {
                            console.log(errr);
                        }
                        else {
                            // updating credits of the second user by newuser2credits
                            User.updateOne({ name: req.body.user2 }, { $set: { credits: newuser2credits } }, function (e, r) {
                                if (e) {
                                    console.log(e);
                                    // if updation of second user fails the credits of first user are returned back
                                    User.find({ name: req.body.user1 }, function (err, response) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        else {
                                            newuser1credits = parseInt(response[0].credits, 10) + parseInt(req.body.credits, 10);
                                        }
                                    })
                                }
                                else {
                                    // if everything goes fine redirecting to users page
                                    res.redirect("/users");
                                }
                            })
                        }
                    })

                }
            })

        }
    })
}
)


app.listen(3000, function () {
    console.log("server started");
})