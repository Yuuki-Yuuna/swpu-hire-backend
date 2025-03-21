import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Company } from '@/company/schema/company.schema'
import { User } from '@/user/schema/user.schema'
import { Job } from '@/job/schema/job.schema'
import { ApplyStatus } from '@/common/enum'

@Schema({ collection: 'interview' })
export class Interview extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  userId: Types.ObjectId // 用户id

  @Prop({ type: Types.ObjectId, required: true, ref: Job.name })
  jobId: Types.ObjectId // 岗位id

  @Prop({ type: Types.ObjectId, required: true, ref: Company.name })
  companyId: Types.ObjectId // 企业id

  @Prop({ required: true })
  jobName: string // 岗位名称

  @Prop({ required: true })
  companyName: string // 企业名称

  @Prop({ required: true })
  applyTime: number // 申请时间

  @Prop({ required: true })
  status: ApplyStatus // 状态

  @Prop()
  description?: string // 附件内容
}

export const InterviewSchema = SchemaFactory.createForClass(Interview)
