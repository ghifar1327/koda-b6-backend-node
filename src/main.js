import "dotenv/config";
import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import db from "./lib/db.js";
import { initRedis } from "./lib/redis.js";
import adminRouter from "./routes/admin.router.js";
import authRouter from "./routes/auth.router.js";
import cartRouter from "./routes/cart.router.js";
import landingRouter from "./routes/landing.router.js";
import masterRouter from "./routes/master.router.js";
import productRouter from "./routes/product.router.js";
import transactionRouter from "./routes/transactions.router.js";
import usersRouter from "./routes/users.router.js";
import auth from "./middleware/auth.middleware.js";
import cors from "./middleware/cors.meddleware.js";

export const conn = db();
const app = express();

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node.js Backend API",
      version: "1.0.0",
      description: "API documentation for the Node.js backend",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(express.json());
app.use(cors);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/admin", auth, adminRouter);
app.use("/auth", authRouter);
app.use("/cart", auth, cartRouter);
app.use("/landing", landingRouter);
app.use("/master", masterRouter);
app.use("/products", productRouter);
app.use("/transactions", auth, transactionRouter);
app.use("/users", usersRouter);

app.get("/", function(req, res){
    res.json({
        success : true,
        message: "backend is running"
    });
});

app.listen(process.env.PORT, async function(){
    console.log(`App listening on port ${process.env.PORT}`);
    console.log(`Swagger docs available at http://localhost:${process.env.PORT}/api-docs`);

    // Initialize Redis
    try {
        await initRedis();
        console.log("Redis cache initialized successfully");
    } catch (error) {
        console.warn("Redis cache failed to initialize:", error.message);
        console.warn("Application will continue without caching");
    }
});