import { Request, Response, NextFunction } from 'express';

import { respondError } from '../helpers';

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    // console.log('authenticationFailed');
    respondError(res, 'authenticationFailed');
  } else {
    // console.log('authenticated');
    return next();
  }
};
