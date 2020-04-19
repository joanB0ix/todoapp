import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from './interfaces/todo.interface';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
    constructor(@InjectModel('Todos') private readonly todoModel: Model<Todo>){}

    async createTodo(user_id:string, createTodoDto: CreateTodoDto){
        const createdTodo = new this.todoModel(createTodoDto);
        await createdTodo.save();
        return await this.todoModel.find({username_id: user_id});
    }

    async updateTodo(id, updateTodoDto: UpdateTodoDto, user_id: string){
        await this.todoModel.updateOne({_id: id}, updateTodoDto, {new: true, multi: false});
        return await this.todoModel.find({username_id: user_id});
    }

    async findAllByUserId(user_id: string){
        return await this.todoModel.find({username_id: user_id});
    }

    async deleteTodo(id: string, user_id: string){
        await this.todoModel.findOneAndDelete({ _id: id });
        const pene = await this.todoModel.find({username_id: user_id});
        return pene;
    }

    async findOne(id: string){
        return await this.todoModel.findOne({_id: id});
    }

    async removeByCategory(category: string, id: string){
        return await this.todoModel.deleteMany({username_id: id, category: category});
    }

    async deleteChecked(){
        return await this.todoModel.deleteMany({checked: true});
    }
}
