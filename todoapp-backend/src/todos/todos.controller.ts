import { Controller, Post, Body, Get, Request, UseGuards, Delete, Param, Put, UnauthorizedException} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
export class TodosController {
    constructor(private readonly todosService: TodosService){}
    
    @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(@Body() createTodoDto: CreateTodoDto, @Request() req){
        createTodoDto.username_id = req.user.userId;
        return this.todosService.createTodo(req.user.userId,createTodoDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('todolist')
    async getTodos(@Request() req){
        return this.todosService.findAllByUserId(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete/:id')
    async deleteTodo(@Param('id') id : string, @Request() req){
        return this.todosService.deleteTodo(id, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put('update/:id')
    async updateTodo(@Param('id') id : string, @Body() updateTodoDto: UpdateTodoDto, @Request() req){
        let todo = await this.todosService.findOne(id);
        if(todo.username_id === req.user.userId){
            return this.todosService.updateTodo(id, updateTodoDto, req.user.userId);
        }else{
            throw new UnauthorizedException;
        }
    }
}
