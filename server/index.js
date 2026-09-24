import express from "express";
import cors from "cors";
import session from "express-session";

import { taskRouter } from "./routes/taskRoute.js";
import { authRouter } from "./routes/authRoute.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://daily-task-management-1.netlify.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
      sameSite: isProduction ? "none" : "lax",
    },
  }),
);

app.use("/api/auth", authRouter);
app.use("/api", taskRouter);

app.listen(PORT, () => console.log(`server is listening on port ${PORT}`));
