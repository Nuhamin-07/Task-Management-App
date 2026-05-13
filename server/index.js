import express from "express";
import cors from "cors";

import { taskRouter } from "./routes/taskRoute.js";

const app = express();
app.use(cors());

const PORT = 3000;

app.use(express.json());

app.use("/api", taskRouter);

app.listen(PORT, () => console.log(`server is listening on port ${PORT}`));
