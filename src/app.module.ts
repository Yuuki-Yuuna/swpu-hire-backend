import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { AppController } from './app.controller'
import { AppService } from './app.service'

import { UserModule } from './user/user.module'

const databaseUrl = 'mongodb://localhost:27017/swpu-hire'

@Module({
  imports: [MongooseModule.forRoot(databaseUrl), UserModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
