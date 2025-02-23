import { Company } from '@/company/schema/company.schema'
import { Job } from './schema/job.schema'

export type RecommendJobData = Job & { company: Company }
