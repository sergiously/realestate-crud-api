// @ts-nocheck
import type {
  Request,
  Response,
  NextFunction
} from 'express';


/**
 * Custom validation input error handler middleware for Express HTTP responses
 *
 * @param err - Error
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * 
 * @returns Express response object, formatted for custom error
 */
const joiParseError = (err, req: Request, res: Response, next: NextFunction) => {
  if (err && err.error && err.error.isJoi) {
    res.status(400).json({
      message: 'Invalid request',
      validationErrors: err.error.details.map(({ message, context, path }) => ({
        path,
        error: message.replace(`"${context.label}" `, ''),
      })),
    });
  } else {
    next(err);
  }
};


export {
  joiParseError,
};
