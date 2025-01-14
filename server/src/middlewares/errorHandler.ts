import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes"
import { customApiError } from "../errors/customError";
import { ZodError } from "zod";
import { fromError } from "zod-validation-error";
import { ForbiddenError } from "@casl/ability";


export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {

    let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    let message = err.message || "An unexpected error occurred" ;
    
    if (err instanceof customApiError) {
        statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    } else if (err instanceof ZodError){
        statusCode = StatusCodes.BAD_REQUEST
        message = fromError(err).toString()
    } else if (err instanceof ForbiddenError){
        statusCode = StatusCodes.FORBIDDEN
    }

    res.status(statusCode).json({ error: message});
};
