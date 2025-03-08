import { Controller, Get } from '@nestjs/common'
import { StudentService } from './student.service'
import { UserId } from '@/user/user.guard'

@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get('source-info')
  sourceInfo(@UserId() userId: string) {
    return this.studentService.sourceInfo(userId)
  }
}
