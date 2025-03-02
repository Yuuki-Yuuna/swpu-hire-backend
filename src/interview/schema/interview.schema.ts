import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, ObjectId } from 'mongoose'
import { User } from '@/user/schema/user.schema'
import { Job } from '@/job/schema/job.schema'
import { ApplyStatus } from '@/common/enum'

@Schema({ collection: 'interview' })
export class Interview extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  userId: ObjectId // 用户id

  @Prop({ type: Types.ObjectId, required: true, ref: Job.name })
  jobId: ObjectId // 岗位id

  @Prop({ required: true })
  jobName: string // 岗位名称

  @Prop({ required: true })
  companyName: string // 企业名称

  @Prop({ required: true })
  applyTime: number // 申请时间

  @Prop({ required: true })
  status: ApplyStatus // 状态
}

export const InterviewSchema = SchemaFactory.createForClass(Interview)
