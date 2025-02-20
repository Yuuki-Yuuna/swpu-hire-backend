import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

// token黑名单
@Schema({ collection: 'black-list' })
export class BlackList extends Document {
  @Prop({ required: true, unique: true })
  token: string

  @Prop({ required: true })
  userId: string

  @Prop({ required: true })
  username: string

  @Prop({ required: true })
  expireTime: number // 过期时间
}

export const BlackListSchema = SchemaFactory.createForClass(BlackList)

// 添加 TTL 索引（自动删除过期文档）
BlackListSchema.index({ expireTime: 1 }, { expireAfterSeconds: 0 })
