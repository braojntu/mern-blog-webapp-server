const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");

// App Config
const app = express();
dotenv.config();
const port = process.env.PORT;
const url = process.env.MONGO_URL;
app.use("/images", express.static(path.join(__dirname, "/images")));

// Middlewares
app.use(express.json());
app.use(cors());

// DB Config
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

// Storage Path
const upload = multer({storage: storage});
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

// API Endpoints
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

// Listener
app.listen(port, () => {
  console.log(`Nodejs Backend is running on port ${port}`);
});