const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

//////////////////////////////// Requests targeting all Articles ///////////////////////////////////////

app.route("/articles")
    .get(function (req, res) {
        Article.find(function (err, foundArticles) {
            res.send(foundArticles);
        });
    })
    .post(function (req, res) {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })

        newArticle.save(function (req, res) {
            if (!err) {
                res.send("Successfully added a new article");
            } else {
                res.send(err);
            }
        });
    })
    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Successfully deleted all items.");
            } else {
                res.send(err);
            }
        });
    });

////////////////////////////// Requests targeting specific Articles //////////////////////////////////

app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle }, function (err, foundArticles) {
            if (foundArticles) {
                res.send(foundArticles);
            } else {
                res.send("No Article matching that title was found.");
            }
        })
    })

    .put(function (req, res) {
        Article.update(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            { overwrite: true },
            function (err) {
                if (!err) {
                    res.send("Successfully updated the article.");
                }
            }
        );
    })

    .patch(function (req, res) {
        Article.update(
            { title: req.params.articleTitle },
            { $set: req.body },
            function (err) {
                if (!err) {
                    res.send("Successfully updated the aritcles");
                } else {
                    res.send(err);
                }
            });
    })

    .delete(function (req, res) {
        Article.deleteOne({ title: req.params.articleTitle }, function (err) {
            if (!err) {
                res.send("Successfully deleted.")
            } else {
                res.send(err);
            }
        });
    });

app.listen(5000, function () {
    console.log("Server is running at port 5000");
})

