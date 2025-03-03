import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class ResumeEditDto {
  @IsString()
  name: string

  @IsString()
  phone: string

  @IsString()
  email: string

  @IsString()
  identify: string

  @IsString()
  @IsOptional()
  selfEvaluation?: string

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ResumeEducation)
  education: ResumeEducation[]

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ResumeIntership)
  intership: ResumeIntership[]

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ResumeProject)
  project: ResumeProject[]
}

class ResumeEducation {
  @IsString()
  school: string

  @IsString()
  degree: string

  @IsArray()
  @IsNumber({}, { each: true })
  timeRange: [number, number]

  @IsString()
  @IsOptional()
  major?: string
}

class ResumeIntership {
  @IsString()
  company: string

  @IsString()
  position: string

  @IsArray()
  @IsNumber({}, { each: true })
  timeRange: [number, number]

  @IsString()
  @IsOptional()
  desc?: string
}

class ResumeProject {
  @IsString()
  name: string

  @IsString()
  @IsOptional()
  role?: string

  @IsArray()
  @IsNumber({}, { each: true })
  timeRange: [number, number]

  @IsString()
  @IsOptional()
  link?: string

  @IsString()
  desc: string
}
