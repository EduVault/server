import { IPerson, IApp } from './models/types';
import * as passport from 'passport';

// Shims
declare module 'express-session' {
  interface SessionData {
    cookie: Cookie;
    jwt: string;
    oldJwt: string;
  }
}
declare module 'passport' {
  interface User extends AppPerson {}
}

export interface LoginToken {
  data: { appID: string; personID: string };
  iat: number;
  exp: number;
}

export type AppPerson = { app: IApp; person: IPerson };
export * from './routes/types';
export * from './models/types';
