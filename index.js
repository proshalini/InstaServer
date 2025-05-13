const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add this to support JSON payloads

const path = require("path");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use('/assets', express.static(__dirname + '/assets'));

app.set("view engine", "ejs");

const { v4: uuidv4 } = require("uuid");

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const multer = require('multer');
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Keep file extension
    }
});

const upload = multer({ storage: storage });
app.use("/uploads", express.static("uploads")); // Ensure images can be served



let posts = [
    {
        id: uuidv4(),
        username: "singhshalini_18",
        pic: "/assets/p1.jpg",
        caption: "feeling candid :)",
        comments: [
            "preety",
        ],
    },
    {
        id: uuidv4(),
        username: "singhshambhabi_13",
        pic: "/assets/p2.jpg",
        caption: "minimalist <3",
        comments: [
            "preety",
        ],
    },
    {
        id: uuidv4(),
        username: "singhss.10",
        pic: "/assets/p3.jpg",
        caption: "blinking the smile :)",
        comments: [
            "preety",
        ],
    },
    {
        id: uuidv4(),
        username: "ss.12",
        pic: "/assets/p4.jpg",
        caption: "adiye paani da rang chadha k aa $$",
        comments: [
            "preety",
        ],
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

app.post("/posts", upload.single("pic"), (req, res) => {
    let id = uuidv4();
    let { username, caption } = req.body; // Ensure req.body is parsed properly
    let imagePath = req.file ? `/uploads/${req.file.filename}` : "/assets/default.jpg"; // Fallback for missing image

    if (!username || !caption) {
        return res.status(400).send("Username and caption are required!");
    }

    posts.unshift({
        id,
        username,
        pic: imagePath,
        caption,
        likes: 0,
        comments: [],
        shares: 0
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



