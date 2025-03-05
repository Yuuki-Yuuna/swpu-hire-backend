import { IsArray, IsInt, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class JobListDto {
  @IsInt()
  @Type(() => Number)
  page: number

  @IsInt()
  @Type(() => Number)
  limit: number

  @IsString()
  @IsOptional()
  input?: string

  @IsString()
  @IsOptional()
  city?: string

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  companySize?: number

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  salaryRequirement?: number

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  enterpriseNature?: number
}

export class JobRecommendDto {
  @IsInt()
  @Type(() => Number)
  page: number

  @IsInt()
  @Type(() => Number)
  limit: number
}

export class JobPublishDto {
  @IsString()
  @IsOptional()
  jobId: string

  @IsString()
  jobName: string

  @IsString()
  location: string // 工作地(adcode编码)

  @IsString()
  locationName: string // 工作地

  @IsString()
  degreeName: string // 学历

  @IsString()
  salaryDesc: string // 薪资描述

  @IsInt()
  @Type(() => Number)
  salaryMin: number

  @IsInt()
  @Type(() => Number)
  salaryMax: number

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  showSkills?: string[] // 标签

  @IsString()
  @IsOptional()
  description?: string // 岗位描述
}
