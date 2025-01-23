import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { jwtKey } from '@/common/sercet-key'
import { User, UserSchema } from './schema/user.schema'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserGuard } from './user.guard'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({ secret: jwtKey, signOptions: { expiresIn: '1d' } })
  ],
  controllers: [UserController],
  providers: [{ provide: APP_GUARD, useClass: UserGuard }, UserService]
})
export class UserModule {}
