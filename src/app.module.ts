import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { MongooseModule } from '@nestjs/mongoose'

import { databaseUrl, publicUrl } from './common/sercet-key'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: publicUrl,
      serveRoot: '/static'
    }),
    MongooseModule.forRoot(databaseUrl),
    UserModule
  ]
})
export class AppModule {}
