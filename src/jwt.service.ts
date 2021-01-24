import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';

const dotenv = require('dotenv');
dotenv.config();

@Injectable()
export class JWTService {

    async createToken(email: String, id: String) {
        const expiresIn = process.env.JWT_EXPIRES_IN, secretOrKey = process.env.JWT_SECRET;
        const userInfo = { 
          email: email,
          userId: id, 
        };
        const token = jwt.sign(userInfo, secretOrKey, { expiresIn });
        return {
            expires_in: expiresIn,
            access_token: token,
        };
    }

}
