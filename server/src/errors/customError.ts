import { StatusCodes } from "http-status-codes"

export class customApiError extends Error {
    statusCode: number

    constructor(message: string | string[], statusCode: number){
        if (typeof message === "string") {
            super(message)
        } else {
            const processedMsg = message.join(", ")
            super(processedMsg)
        }

        this.statusCode = statusCode
    }
}


export class NotFoundError extends customApiError {
    constructor(message: string = "Resource not found") {
        super(message, StatusCodes.NOT_FOUND); // Status code is hardcoded to 404
    }
  }
  
export class BadRequestError extends customApiError {
    constructor(message: string = "Bad request") {
        super(message, StatusCodes.BAD_REQUEST); // Status code is hardcoded to 400
    }
  }
  
export class UnauthorizedError extends customApiError {
    constructor(message: string = "Unauthorized access") {
        super(message, StatusCodes.UNAUTHORIZED); // Status code is hardcoded to 401
    }
  }

export class CorsError extends customApiError {
    constructor(message: string = "CORS violation detected") {
      super(message, StatusCodes.BAD_GATEWAY); // HTTP Status Code for Authentication Timeout, a CORS error scenario
    }
  }

export class ForbiddenError extends customApiError {
    constructor(message: string = "Access forbidden") {
      super(message, StatusCodes.FORBIDDEN); // HTTP Status Code for Forbidden access
    }
  }
  
export class NotImplementedError extends customApiError {
    constructor(message: string = "Not Implemented") {
      super(message, StatusCodes.NOT_IMPLEMENTED); // HTTP Status Code for unimplemented functionality
    }
  }

export class ConflictError extends customApiError {
    constructor(message: string = "Conflict occurred") {
      super(message, StatusCodes.CONFLICT); // HTTP Status Code for conflict
    }
  }
  
  export class InternalServerError extends customApiError {
    constructor(message: string = "There is something wrong with your code") {
      super(message, StatusCodes.INTERNAL_SERVER_ERROR); // HTTP Status Code for conflict
    }
  }

  
  