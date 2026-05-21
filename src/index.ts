import express from "express";

import requestRoutes from "./routes/request.routes";
import productRoutes from "./routes/product.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(express.json());

app.use((err: any, _: any, res: any, next: any) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json({
      error: "Invalid JSON",
    });
  }

  next();
});

app.use("/", requestRoutes);

app.use("/", productRoutes);

app.get("/", (_, res) => {
  res.json({
    message: "API working",
  });
});

app.use(errorMiddleware);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});