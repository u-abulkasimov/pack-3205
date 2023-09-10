import { ValidationError } from "express-validator";

type TApiException = Record<string, string>[] | ValidationError[] | string;

export default TApiException;