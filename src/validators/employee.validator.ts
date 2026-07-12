import Joi from 'joi';

export const createEmployeeSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  age: Joi.number().integer().min(18).max(75).required(),
  designation: Joi.string().min(2).max(100).required(),
  hiring_date: Joi.date().iso().required(),
  date_of_birth: Joi.date().iso().required(),
  salary: Joi.number().positive().required(),
});

export const updateEmployeeSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  age: Joi.number().integer().min(18).max(75),
  designation: Joi.string().min(2).max(100),
  hiring_date: Joi.date().iso(),
  date_of_birth: Joi.date().iso(),
  salary: Joi.number().positive(),
});