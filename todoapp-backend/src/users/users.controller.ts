import { Controller, Post, Body, Get, Param, Put, Request, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt = require('bcrypt');
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TodosService } from 'src/todos/todos.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService,
        private readonly todosService: TodosService){}

    @Post('create')
    async create(@Body() createUserDto: CreateUserDto){
        const hash = bcrypt.hashSync(createUserDto.password, 10);
        createUserDto.password = hash;
        this.usersService.createUser(createUserDto);
    }

    @Get('check/user/:user')
    async checkUser(@Param('user') user:string): Promise<string>{
        return await this.usersService.userCheck(user);
    }

    @Get('check/email/:email')
    async checkEmail(@Param('email') email:string): Promise<string>{
        return await this.usersService.emailCheck(email);
    }
    
    @UseGuards(JwtAuthGuard)
    @Put('update/add/category/:category')
    async addCategory(@Param('category') category:string, @Request() req){
        return this.usersService.addCategory(category, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put('update/remove/category/:category')
    async removeCategory(@Param('category') category:string, @Request() req){
        this.todosService.removeByCategory(category, req.user.userId);
        return this.usersService.removeCategory(category, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('categories')
    async getCategories(@Request() req): Promise<string[]>{
        return await this.usersService.getCategories(req.user.userId);
    }
}
