import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  // signup(@Req() req: Request) {
  // signup(@Body('email') email: string, dto: AuthDto) {
  signup(
    @Body() dto: AuthDto,
    // @Body('email') email: string,
    // @Body('password', ParseIntPipe) password: string,
  ) {
    // console.log('dto :>> ', { dto });
    // return req.body;
    // console.log({
    //   email,
    //   typeofemail: typeof email,
    //   password,
    //   typeofpassword: typeof password,
    // });
    // return dto;
    return this.authService.signup(dto);
  }
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
}
