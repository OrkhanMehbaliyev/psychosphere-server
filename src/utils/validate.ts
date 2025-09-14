import { BadRequestError } from "./appError.js";
import type { ZodObject } from "zod";

const validateSchema = (schema: ZodObject, data: any) => {
  try {
    return schema.parse(data);
  } catch (err) {
    throw new BadRequestError("Invalid request data");
  }
};

export default validateSchema;
