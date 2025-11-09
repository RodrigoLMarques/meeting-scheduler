import { NextFunction, Request, Response } from "express";
import { userService } from "../services/user.service";

class UserController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAll();
      return res.status(200).json(users.map((user) => user.toJSON()));
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.create(req.body);
      return res.status(201).json(user.toJSON());
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
