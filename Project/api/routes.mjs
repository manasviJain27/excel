import { Router } from "express";
import authRoutes from "./excel/routes.mjs";
const router = new Router();

authRoutes(router);

export default router;
