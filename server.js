import dotenv from "dotenv";
import express from "express";
import userRouter from "./src/routers/userRouter.js";
const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRouter);
app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
