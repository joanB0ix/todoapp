import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if(user && bcrypt.compareSync(pass, user.password)){
            const {password, ...result} = user;
            return result;
        }
        return null;
    }

    async login(user:any){
        const payload = { username: user.name, email: user.email, id: user._id }
        return {
            access_token: this.jwtService.sign(payload),
        }
    }
}
