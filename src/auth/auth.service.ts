import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
// import { User, Bookmark } from '@prisma/client';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: AuthDto) {
    // generate the password hash
    const hash = await argon.hash(dto.password);
    // save the new user
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
        // one way return only fields by prisma
        // select: {
        //   id: true,
        //   email: true,
        //   createdAt: true,
        // },
      });
      //return new user
      delete user.hash;
      return this.signToken(user.id, user.email);
      return user;
      // return { message: 'signup' };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
        throw error;
      }
    }
  }

  async signin(dto: AuthDto) {
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // if user is not exists throw exceptions
    if (!user) throw new ForbiddenException('Credentials incorrest');
    // compare passwords
    const pwMatches = await argon.verify(user.hash, dto.password);
    // if password is incorrect throw exception
    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrest');
    }
    // send back the user
    delete user.hash;
    // return user;
    return this.signToken(user.id, user.email);
  }
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });

    return { access_token: token };
  }
}
