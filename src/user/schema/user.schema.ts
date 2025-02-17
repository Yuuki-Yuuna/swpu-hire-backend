import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ collection: 'user' })
export class User extends Document {
  @Prop()
  username: string

  @Prop()
  password: string

  @Prop()
  studentName: string

  @Prop()
  graduationYear: number
}

export const UserSchema = SchemaFactory.createForClass(User)
