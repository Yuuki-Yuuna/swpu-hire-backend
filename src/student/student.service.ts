import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from '@/user/schema/user.schema'
import { Student } from './schema/student.schema'
import { UserType } from '@/common/enum'
import { createResponse } from '@/common/response'

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Student.name) private studentModel: Model<Student>
  ) {}

  async sourceInfo(userId: string) {
    const user = await this.userModel.findById(userId).exec()
    if (user?.userType !== UserType.Student) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '非法用户' })
    }

    const result = await this.studentModel.findById(userId).exec()
    return createResponse(result)
  }
}
