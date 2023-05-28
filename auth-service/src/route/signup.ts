import express ,{Request,Response} from 'express';
import {body} from "express-validator";
import {requestValidator,BadRequestError} from '@wyf-ticketing/wyf';
import jwt from 'jsonwebtoken';
import client from '../tools/pgClient';
import { PasswordUtils } from '../tools/PasswordUtils';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.post('/api/users/signup',
    [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({min: 4, max: 20})
        .withMessage('PasswordUtils must be between 4 and 20 CH')
    ],
   requestValidator,
   async (req: Request, res: Response) => {

        const {email ,password} = req.body;
        const result = await client.query(`SELECT * FROM users WHERE user_email = '${email}';`);
        if(result.rowCount != 0){
            throw new BadRequestError('Email in use');
        }
        const hashed = await PasswordUtils.hash(password);
        const id = uuidv4();
        const insertQuery = "INSERT INTO users (id, user_email, password) VALUES ($1, $2, $3);";
        const user = {
            id: id,
            user_email: email,
            password: hashed
        }
        const value = [id, email, hashed];
        await client.query(insertQuery, value);
        // generate JWT
        process.env.JWT_SECRET = "wda";
        const userJWT = jwt.sign({
           id: user.id,
           email: user.user_email
        },process.env.JWT_SECRET!);

        // In my view, this can't be valid as soon as
        // a user was created, it should be valid in sign
        // in the process.
        // add JWT to Cookie field
        req.session = {jwt:userJWT};

        res.status(201).send(user);
        // console.log("Creating User.");
        // throw new Error("WTF!");
        // res.send({});
    });

export { router as signUpRouter };