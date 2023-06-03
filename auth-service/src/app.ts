import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import cookieSession from "cookie-session";

import {currentUserRouter} from "./route/current-user";
import {signInRouter} from "./route/signin";
import {signUpRouter} from "./route/signup";
import {signOutRouter} from "./route/signout";
import {errorHandler,NotFoundError} from '@wyf-ticketing/wyf';
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials:true,
    optionSuccessStatus:200
}
const app = express();
app.set('trust proxy', true); // ?
app.use(cors(corsOptions));
app.use(json());
app.use(cookieSession({
    signed:false,
    secure:false
}))
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);


app.get('*',async (req,res)=>{
    throw new NotFoundError('Not Found Here!');
});
app.use(errorHandler);
export {app};