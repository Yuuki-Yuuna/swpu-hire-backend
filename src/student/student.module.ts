import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from '@/user/schema/user.schema'
import { Student, StudentSchema } from './schema/student.schema'
import { StudentController } from './student.controller'
import { StudentService } from './student.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Student.name, schema: StudentSchema }
    ])
  ],
  controllers: [StudentController],
  providers: [StudentService]
})
export class StudentModule {}
