import Joi from 'joi';

export const createAttendanceSchema = Joi.object({
  employee_id: Joi.number().integer().positive().required(),
  date: Joi.date().iso().required(),
  check_in_time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
    .required()
    .messages({ 'string.pattern.base': 'check_in_time must be in HH:mm or HH:mm:ss format' }),
});

export const updateAttendanceSchema = Joi.object({
  date: Joi.date().iso(),
  check_in_time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/),
});