import { NextFunction, Request, Response } from "express";

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction): void => {
    try {
      res.status(200).json({ message: "Hello World!" });
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
