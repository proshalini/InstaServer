const express = require("express");
const app = express();
const port = 8080;

const path = require("path");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use('/assets', express.static(__dirname + '/assets'));

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const { v4: uuidv4 } = require("uuid");

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const multer = require('multer');
const upload = multer({ dest: 'assets/' });

let posts = [
    {
        id: uuidv4(),
        username: "singhshalini_18",
        pic: "/assets/p1.png",
        caption: "feeling candid :)",
        likes: "120",
        comments: [
            "preety",
        ],
        share: "3",
    },
    {
        id: uuidv4(),
        username: "singhshambhabi_13",
        pic: "/assets/p2.png",
        caption: "minimalist <3",
        likes: "120",
        comments: [
            "preety",
        ],
        share: "3",
    },
    {
        id: uuidv4(),
        username: "singhss.10",
        pic: "/assets/p3.png",
        caption: "blinking the smile :)",
        likes: "120",
        comments: [
            "preety",
        ],
        share: "3",
    },
    {
        id: uuidv4(),
        username: "ss.12",
        pic: "/assets/p4.png",
        caption: "adiye paani da rang chadha k aa $$",
        likes: "120",
        comments: [
            "preety",
        ],
        share: "3",
    }
]

app.listen(port, () => {
    console.log("Server listening on port");
})

app.get("/posts", (req, res) => {
    res.render("index", { posts });
})

app.get("/posts/new", (req, res) => {
    res.render("new", { posts });
})

app.get("/posts/:id", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id == p.id);
    res.render("show", { post });
})



app.patch("/posts/:id", (req, res) => {
    let { id } = req.params;
    let newCap = req.body.caption;
    let post = posts.find((p) => id == p.id);
    post.caption = newCap;
    res.redirect("/posts");
})

app.get("/posts/:id/edit", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id == p.id);
    res.render("edit", { post });
})

app.post("/posts", (req, res) => {
    let id = uuidv4();
    let { username,pic, caption } = req.body;
    let imagePath = pic.startsWith("/assets/") ? pic : `/assets/${pic}`;
    posts.push({
        id,
        username,
        pic:imagePath,
        caption,
        likes: 0,       // Initialize likes to 0
        comments: [],    // Initialize comments as an empty array
        shares: 0        // Initialize shares to 0
    });

    res.redirect("/posts");
});


app.delete("/posts/:id", (req, res) => {
    let { id } = req.params;
    posts = posts.filter((p) => id != p.id);
    res.redirect("/posts");
})

app.post("/posts/:username", (req, res) => {
    let { username } = req.params;
    let newCom = req.body.comments;
    let post = posts.find((p) => username == p.username);
    let commentString = String(newCom).trim(); // Convert to string and remove extra spaces

    if (commentString.length > 0) { // Ensure it's not empty
        post.comments.push(commentString); // Add properly formatted comment
    }
    res.redirect("/posts");
})
app.get("/posts/:username/opinion", (req, res) => {
    let { username } = req.params;
    let post = posts.find((p) => username == p.username);
    res.render("opinion", { post });
})



