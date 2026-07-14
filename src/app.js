import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import entityRoutes from "./routes/entity.routes.js";
import favouriteRoutes from './routes/favourite.routes.js'
import aiRoutes from './routes/ai.routes.js'
import adminRoutes from "./routes/admin.routes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use("/api/auth", authRoutes);
app.use("/api/entities", entityRoutes);
app.use("/api/fav", favouriteRoutes);
app.use('/api/ai', aiRoutes);
app.use("/api/admin", adminRoutes);


export default app;