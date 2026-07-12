import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

export function validate(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    if (error) {
      const message = error.details[0]?.message ?? 'Validation error';
      res.status(400).json({ message });
      return;
    }
    next();
  };
}