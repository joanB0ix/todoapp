import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { Todo } from 'src/todos/interfaces/todo.interface';

@Injectable()
export class UsersService {
    constructor(@InjectModel('Users') private readonly userModel: Model<User>){}

    async createUser(createUserDto: CreateUserDto){
        const createdUser = new this.userModel(createUserDto);
        return await createdUser.save();
    }

    async findOne(username: string){
        return this.userModel.findOne({name: username});
    }

    async userCheck(username:string){
        let user = await this.userModel.findOne({name: username});
        if(user){
            return 'Username is already in use';
        }else{
            return '';
        }
    }

    async emailCheck(email:string){
        let user = await this.userModel.findOne({email: email});
        if(user){
            return 'Email is already in use';
        }else{
            if(email.includes('@')){
                return '';
            }
            return 'Email should have a valid format';
        }
    }

    async addCategory(category: string, user_id: string){
        await this.userModel.findOne({_id: user_id}, async function(err, user){
            if(user){
                user.categories.push(category);
                await user.save();
            }
        });

        var lmao = await this.userModel.findOne({_id: user_id});
        return lmao.categories;
    }

    async removeCategory(category: string, user_id: string){
        await this.userModel.findOne({_id: user_id}, async function(err, user){
            if(user){
                let index = user.categories.indexOf(category);
                if(index > -1){
                    user.categories.splice(index, 1);
                }
                await user.save();
            }
        });
        var lmao = await this.userModel.findOne({_id: user_id});
        return lmao.categories;
    }

    async getCategories(user_id: string){
        var lmao = await this.userModel.findOne({_id: user_id});
        return lmao.categories;
    }
}
