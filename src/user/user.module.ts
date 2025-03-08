import { Module } from '@nestjs/common'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { jwtKey } from '@/common/sercet-key'
import { User, UserSchema } from './schema/user.schema'
import { Company, CompanySchema } from '@/company/schema/company.schema'
import { BlackList, BlackListSchema } from './schema/black-list.schema'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserGuard } from './user.guard'
import { TokenExpiredErrorFilter } from './user.filter'
import { BlackListService } from './black-list.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Company.name, schema: CompanySchema },
      { name: BlackList.name, schema: BlackListSchema }
    ]),
    JwtModule.register({ secret: jwtKey, signOptions: { expiresIn: '1d' } })
  ],
  controllers: [UserController],
  providers: [
    { provide: APP_GUARD, useClass: UserGuard },
    { provide: APP_FILTER, useClass: TokenExpiredErrorFilter },
    BlackListService,
    UserService
  ]
})
export class UserModule {}
