if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { Movie } = require('./models/')

//! MULTER
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//! CLOUDINARY & AXIOS
const cloudinary = require("cloudinary").v2;
const axios = require("axios");

const express = require("express");
const app = express();

const Controller = require("./controller/controller");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  console.log("Server running");
  res.json("Server running"); // Status 200
});

app.post("/register", Controller.register);
app.post("/login", Controller.login);

app.post("/movies", async (req, res) => {
  try {
    const { title, rating } = req.body;

    const movie = await Movie.create({ title, rating });

    res.status(201).json(movie)
  } catch (err) {
    if(err.name === 'SequelizeValidationError') {
      res.status(400).json({
        message: err.errors[0].message
      })
    } else {

      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

app.get("/movies", async (req, res) => {
  try {
    console.log(req.headers, '<-- headers')
    const movies = await Movie.findAll()

    res.json(movies)
  } catch(err) {
    res.status(500).json({ message: "Internal Server Error" });
  } 
});

app.get("/movies/tmdb", async (req, res) => {
  try {
    const { data } = await axios({
      method: "get",
      url: "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=2&sort_by=popularity.desc",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNDJmYWJiZTI1ZDEzODRkNDZlOTY5NjkxNDhmMWRhYyIsIm5iZiI6MTcyMTcxNTI0NC4xMDYwODksInN1YiI6IjY1NjQ4ZThlYjIzNGI5MDEzOTI4YmFkZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JyfSIbrzHh-DzKenn-PawAopqQ1kwVcQuYScSvgAPB4",
        accept: "application/json",
      },
    });

    console.log(
      data.results.map((el) => el.original_title),
      "<--***"
    );
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "ISE" });
  }
});

app.post("/profile", upload.single("avatar"), async function (req, res, next) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const b64File = Buffer.from(req.file.buffer).toString("base64");
    ("data:image/png;base64,iVB");

    const dataURI = `data:${req.file.mimetype};base64,${b64File}`;

    const uploadFile = await cloudinary.uploader.upload(dataURI, {
      folder: "cakep",
      public_id: req.file.originalname,
    });

    // ! INI SESUAIKAN DENGAN CHALLENGE ANDA SENDIRI BROH
    // await Movie.update({ imgUrl: uploadFile.secure_url })

    res.status(200).json({
      message: `Image Movie success to update`,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


//! INI DI APP SUDAH TIDAK LISTEN LAGI DAN DI MODULE EXPORTS
module.exports = app;
