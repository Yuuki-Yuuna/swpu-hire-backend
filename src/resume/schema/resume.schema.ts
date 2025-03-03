import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, ObjectId } from 'mongoose'
import { User } from '@/user/schema/user.schema'

@Schema({ collection: 'resume' })
export class Resume extends Document {
  @Prop({ type: Types.ObjectId, required: true, unique: true, ref: User.name })
  userId: ObjectId // 用户id

  @Prop({ required: true })
  name: string // 姓名

  @Prop({ required: true })
  phone: string // 电话

  @Prop({ required: true })
  email: string // 邮箱

  @Prop({ required: true })
  identify: string // 身份证

  @Prop({
    type: [
      {
        school: { type: String, required: true },
        degree: { type: String, required: true },
        timeRange: { type: [Number], required: true },
        major: { type: String }
      }
    ]
  })
  education: ResumeEducation[]

  @Prop({
    type: [
      {
        company: { type: String, required: true },
        position: { type: String, required: true },
        timeRange: { type: [Number], required: true },
        desc: { type: String }
      }
    ]
  })
  intership: ResumeIntership[]

  @Prop({
    type: [
      {
        name: { type: String, required: true },
        role: { type: String },
        timeRange: { type: [Number], required: true },
        link: { type: String },
        desc: { type: String, required: true }
      }
    ]
  })
  project: ResumeProject[]

  @Prop()
  selfEvaluation?: string // 自我评价
}

export const ResumeSchema = SchemaFactory.createForClass(Resume)

interface ResumeEducation {
  school: string
  degree: string
  timeRange: [number, number]
  major?: string
}

interface ResumeIntership {
  company: string
  position: string
  timeRange: [number, number]
  desc?: string
}

interface ResumeProject {
  name: string
  role?: string
  timeRange: [number, number]
  link?: string
  desc: string
}
