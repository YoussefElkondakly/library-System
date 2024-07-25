import { default as express, Request, Response, NextFunction } from "express";
import authRoutes from "./routes/authRoutes";
import managerRoutes from "./routes/managerRoutes";
import librarianRoutes from "./routes/librarianRoutes";
import archivistRoutes from "./routes/archivistRoutes";
import patronRoutes from "./routes/patronRoutes";
import { errHandler } from "./util/errHandler";
import AppError from "./util/appError";
import queryValidator from "./util/queryValidation";

const app = express();

let baseUrl = "/librarysystem/";
app.use(baseUrl + "uploads/", express.static("uploads"));
app.use(express.json());

app.use(queryValidator);

app.use(baseUrl + "auth", authRoutes);

app.use(baseUrl + "manager", managerRoutes);

baseUrl = baseUrl + "users/";
app.use(baseUrl + "librarian", librarianRoutes);
app.use(baseUrl + "archivist", archivistRoutes);
app.use(baseUrl + "patron", patronRoutes);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  next(err);
});
app.use(errHandler);
export default app;
