import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types, Document, PopulatedDoc } from 'mongoose'
import { Company } from '@/company/schema/company.schema'

@Schema({ collection: 'job', timestamps: true })
export class Job extends Document {
  @Prop({ required: true })
  jobName: string

  @Prop({ required: true })
  location: string // adcode编码

  @Prop({ required: true })
  locationName: string // 城市

  @Prop()
  degreeName: string // 学历

  @Prop()
  salaryDesc: string // 薪资描述

  @Prop({ required: true })
  salaryMin: number

  @Prop({ required: true })
  salaryMax: number

  @Prop({ type: [String] })
  showSkills: string[] // 标签

  @Prop({ type: Types.ObjectId, required: true, ref: Company.name })
  company: PopulatedDoc<Company> // 企业id

  @Prop({ required: true })
  userId: string // 发布者id

  @Prop({ required: true, default: 0 })
  candidateTotal: number // 投递总数

  @Prop()
  description: string //岗位描述
}

export const JobSchema = SchemaFactory.createForClass(Job)
