import express from "express";
import SERVER_CONFIG from "./config/SERVER_CONFIG.mjs";
import router from "./api/routes.mjs";
import mongoose from "mongoose";

async function mongo() {
  try {
    await mongoose.connect("mongodb://localhost:27017/leap", {
      useNewUrlParser: true,
    });
    console.log("Database connected.");
  } catch {
    console.log("Database connection failed");
  }
}

let app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.bodyParser());
app.use("/", router);
// let PORT = SERVER_CONFIG.PORT;

const { PORT } = SERVER_CONFIG;
const startServer = async () => {
  await app.listen(PORT);
  console.log("Server started successfully and listening to port ", PORT);
};

mongo();
startServer();
