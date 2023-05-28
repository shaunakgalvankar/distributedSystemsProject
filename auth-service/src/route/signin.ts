import express,{ Request,Response } from 'express';
import {body} from "express-validator";
import {BadRequestError,requestValidator} from '@wyf-ticketing/wyf';
import client from '../tools/pgClient';
import { QueryResult } from 'pg';
import {PasswordUtils} from "../tools/PasswordUtils";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post('/api/users/signin',
    [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password must not be Empty!')
        .isLength({min: 4, max: 20})
        .withMessage('Password must be between 4 and 20 CH')
    ],
    requestValidator,
    async (req:Request,res:Response) => {
        const {email,password} = req.body;
        type myRow = {
            id: number;
            user_email: string;
            password: string;
        }
        const result: QueryResult<myRow> = await client.query(`SELECT * FROM users WHERE user_email = '${email}'`);
        if(!result){
            throw new BadRequestError('User doesn\'t exist!');
        }
        const user = result.rows[0];
        const isMatch = await PasswordUtils.compare(
            user.password,
            password
        );
        if(!isMatch){
            throw new BadRequestError('Wrong password, please try again.');
        }
        process.env.JWT_SECRET = "wda";
        const userJWT = jwt.sign({
            id:user.id,
            email:user.user_email
        },process.env.JWT_SECRET!);
        // add JWT to Cookie field
        req.session = {jwt:userJWT};
        // maybe wrong here
        res.send({id : user.id, user_email: user.user_email});
    }
);

export { router as signInRouter };