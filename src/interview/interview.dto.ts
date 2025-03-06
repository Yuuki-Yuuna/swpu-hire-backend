import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString } from 'class-validator'

export class InterViewApplyProcessDto {
  @IsString()
  studentId: string

  @IsString()
  jobId: string

  @IsInt()
  @Type(() => Number)
  status: number

  @IsString()
  @IsOptional()
  description?: string
}
