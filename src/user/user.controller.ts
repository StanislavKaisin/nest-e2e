import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GetUser } from '../../src/auth/decorator';
import { User } from '@prisma/client';

import { JwtGuard } from '../../src/auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  // getMe(@Req() req: Request) {
  getMe(@GetUser() user: User, @GetUser('email') email: string) {
    // console.log({ email });
    return user;
  }
  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
