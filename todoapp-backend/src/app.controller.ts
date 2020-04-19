import { Controller, Get, UseGuards, Post, Request, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req){
    return this.authService.login(req.user._doc);
  }
}
