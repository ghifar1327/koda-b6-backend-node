import "dotenv/config";
import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import db from "./lib/db.js";
import adminRouter from "./routes/admin.router.js";
import authRouter from "./routes/auth.router.js";
import cartRouter from "./routes/cart.router.js";
import landingRouter from "./routes/landing.router.js";
import masterRouter from "./routes/master.router.js";
import productRouter from "./routes/product.router.js";
import transactionRouter from "./routes/transactions.router.js";
import usersRouter from "./routes/users.router.js";
import auth from "./middleware/auth.middleware.js";

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
        url: "http://localhost:9999",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(express.json());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/admin", auth, adminRouter);
app.use("/auth", authRouter);
app.use("/cart", cartRouter);
app.use("/landing", landingRouter);
app.use("/master", masterRouter);
app.use("/product", productRouter);
app.use("/transactions", transactionRouter);
app.use("/users", usersRouter);

app.get("/", function(req, res){
    res.json({
        success : true,
        message: "backend is running"
    });
});

app.listen(9999, function(){
    console.log("App listening on port 9999");
    console.log("Swagger docs available at http://localhost:9999/api-docs");
});