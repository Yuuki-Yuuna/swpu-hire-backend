import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types, Document, PopulatedDoc } from 'mongoose'
import { Company } from '@/company/schema/company.schema'

@Schema({ collection: 'job' })
export class Job extends Document {
  @Prop({ required: true })
  jobName: string

  // @Prop()
  // postDescription: string // 职位描述

  // @Prop()
  // position: number // 岗位编码

  // @Prop()
  // positionName: string // 岗位名

  @Prop({ required: true })
  location: number // adcode编码

  @Prop({ required: true })
  locationName: string // 城市

  // @Prop()
  // address: string // 地址

  @Prop()
  degreeName: string // 学历

  @Prop()
  salaryDesc: string // 薪资描述

  @Prop({ type: [String] })
  showSkills: string[] // 标签

  @Prop({ type: Types.ObjectId, required: true, ref: Company.name })
  company: PopulatedDoc<Company> // 企业id

  @Prop({ required: true })
  userId: string // 发布者id
}

export const JobSchema = SchemaFactory.createForClass(Job)
