import express from "express";
import authRoute from "./routes/auth.js";
import postRoute from "./routes/post.js";
import userRoute from "./routes/user.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running!! ${port}`);
});

