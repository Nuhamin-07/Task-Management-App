import express from "express";
import cors from "cors";
import session from "express-session";

import { taskRouter } from "./routes/taskRoute.js";
import { authRouter } from "./routes/authRoute.js";

const app = express();
app.use(
  cors({
    origin: "https://nuhamin-task-management.netlify.app",
    credentials: true,
  }),
);

const PORT = 3000;

app.use(express.json());

app.set("trust proxy", 1);

app.use(
  session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    },
  }),
);

app.use("/api/auth", authRouter);
app.use("/api", taskRouter);

app.listen(PORT, () => console.log(`server is listening on port ${PORT}`));
