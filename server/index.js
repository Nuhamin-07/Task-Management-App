import express from "express";
import cors from "cors";
import session from "express-session";

import { taskRouter } from "./routes/taskRoute.js";
import { authRouter } from "./routes/authRoute.js";

const app = express();
app.use(cors());

const PORT = 3000;

app.use(express.json());

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  }),
);

app.use("/api/auth", authRouter);
app.use("/api", taskRouter);

app.listen(PORT, () => console.log(`server is listening on port ${PORT}`));
