import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
    // console.log('config :>> ', config); npm i @nestjs/passport passport @nestjs/jwt passport-jwt --force
  }
  //clean db before running e2e tests
  cleanDb() {
    return this.$transaction([
      this.bookmark.deleteMany(),
      this.user.deleteMany(),
    ]);
    this.bookmark.deleteMany();
    this.user.deleteMany();
  }
}
