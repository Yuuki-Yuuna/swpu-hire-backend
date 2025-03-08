import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ collection: 'student' })
export class Student extends Document {
  @Prop()
  avatar?: string

  @Prop({ required: true })
  studentName: string

  @Prop({ required: true })
  graduationYear: number

  @Prop({ required: true })
  gender: string

  @Prop({ required: true })
  identify: string

  @Prop({ required: true })
  sourceLocation: string

  @Prop({ required: true })
  startTime: string

  @Prop({ required: true })
  endTime: string

  @Prop({ required: true })
  degree: string

  @Prop({ required: true })
  college: string

  @Prop({ required: true })
  major: string

  @Prop({ required: true })
  no: string

  @Prop({ required: true })
  phone: string
}

export const StudentSchema = SchemaFactory.createForClass(Student)
