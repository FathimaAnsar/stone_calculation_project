import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import designRouter from "./src/routes/design.routes"
import setRouter from "./src/routes/set.routes"

require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI: string = process.env.MONGODB_URI!;
app.use(express.json());
app.use(cors({
    origin: 'https://stonefrontend-git-register-fathimaansars-projects.vercel.app/',
    methods:['GET','POST','DELETE','PUT'],
    credentials: true
}));
// Connect to MongoDB
mongoose
    .connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err: any) => console.error('MongoDB connection failed:', err));
app.use("/design", designRouter);
app.use("/set", setRouter)
app.get("/", (req, res) => {res.json("welcome")})
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
