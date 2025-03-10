export enum UserType {
  Student, // 学生
  Company, // 企业
  School // 学校
}

export enum ApplyStatus {
  End, // 流程结束
  Apply, // 已申请
  Interview, // 面试中
  Evaluation, // 录用评估
  Hire, // 通过
  Sign // 签约
}

export enum SignStatus {
  Wait, // 等待发起
  Start, // 企业发起
  Check, // 学生受理
  Review, // 学校审核
  Done // 审核通过
}
