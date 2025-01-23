import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { databaseUrl } from './common/sercet-key'
import { UserModule } from './user/user.module'

@Module({
  imports: [MongooseModule.forRoot(databaseUrl), UserModule]
})
export class AppModule {}
