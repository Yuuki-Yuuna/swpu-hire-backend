import { Interview } from '@/interview/schema/interview.schema'
import { Job } from './schema/job.schema'
import { Types } from 'mongoose'
import { cloneDeep } from 'lodash'

type MatrixItem = number | null

const lambda = -0.05 // 入
const decayFunction = (x: number) => Math.exp(lambda * x) // 衰减函数

const initZeroMatrix = (width: number) => {
  return Array.from(new Array(width).keys()).map((key) => {
    const array = new Array<MatrixItem>(width).fill(0)
    array[key] = null
    return array
  })
}

export function collaborativeFiltering(jobList: Job[], interviewList: Interview[]) {
  const matrixSize = jobList.length
  const itemScoreMatrix: Array<MatrixItem[]> = [] // 用户-物品矩阵
  const cooccurrenceMatrix = initZeroMatrix(matrixSize) // 共现矩阵
  const itemTotalScoreList = new Array<number>(matrixSize).fill(0) // 物品总得分

  const applyListMap = new Map<Types.ObjectId | string, Interview[]>() // userId => interview[]

  // 根据userId分组
  for (const interview of interviewList) {
    const { userId } = interview
    const applyList = applyListMap.get(userId) ?? []
    applyListMap.set(userId, [...applyList, interview])
  }

  // 顺序按map中userId顺序
  const userIdArray = Array.from(applyListMap.keys())
  for (const [userId, applyList] of applyListMap.entries()) {
    const itemScoreList = jobList.map<MatrixItem>((job) => {
      // 单个用户每个物品评分，由新到旧衰减
      const applyIndex = applyList.findIndex((item) => isIdEqual(item.jobId, job.id as string))
      const isCollect = job.collectUsers.filter((id) => isIdEqual(userId, id)).length > 0
      const isApply = applyIndex !== -1
      const collectScore = isCollect ? 1 : 0 // 好像没法区分先后，那给个固定分
      const applyScore = isApply ? decayFunction(applyIndex) : null
      // 收藏权重0.2 投递权重0.8
      const itemScore = isCollect || isApply ? 0.2 * collectScore + (applyScore ?? 0) * 0.8 : null
      return itemScore
    })
    itemScoreMatrix.push(itemScoreList)
    itemScoreList.forEach((itemScore, index) => (itemTotalScoreList[index] += itemScore ?? 0))

    // 构建共现矩阵
    for (let i = 0; i < itemScoreList.length; i++) {
      for (let j = i + 1; j < itemScoreList.length; j++) {
        const itemScore = Math.min(itemScoreList[i] ?? 0, itemScoreList[j] ?? 0)
        cooccurrenceMatrix[i][j] = (cooccurrenceMatrix[i][j] ?? 0) + itemScore
        cooccurrenceMatrix[j][i] = (cooccurrenceMatrix[j][i] ?? 0) + itemScore
      }
    }
  }

  const cosineSimilarityMatrix = initZeroMatrix(matrixSize) // 余弦相似矩阵
  for (let i = 0; i < matrixSize; i++) {
    for (let j = i + 1; j < matrixSize; j++) {
      let cosineSimilarityValue = 0
      const arithmeticAverage = Math.sqrt(itemTotalScoreList[i] * itemTotalScoreList[j])
      if (arithmeticAverage) {
        cosineSimilarityValue = (cooccurrenceMatrix[i][j] as number) / arithmeticAverage
      }
      cosineSimilarityMatrix[i][j] = cosineSimilarityValue
      cosineSimilarityMatrix[j][i] = cosineSimilarityValue
    }
  }

  const collaborativeMatrix = cloneDeep(itemScoreMatrix) // 最终评分矩阵

  for (let i = 0; i < collaborativeMatrix.length; i++) {
    for (let j = 0; j < collaborativeMatrix[i].length; j++) {
      if (itemScoreMatrix[i][j] !== null) {
        continue
      }

      let itemScore = 0
      const itemScoreLine = itemScoreMatrix[i].map((item) => item ?? 0)
      const cosineSimilarityLine = cosineSimilarityMatrix[j].map((item) => item ?? 0)
      for (let k = 0; k < matrixSize; k++) {
        itemScore += itemScoreLine[k] * cosineSimilarityLine[k]
      }
      collaborativeMatrix[i][j] = itemScore
    }
  }

  return { collaborativeMatrix, userIdArray }
}

const isIdEqual = (leftId: Types.ObjectId | string, rightId: Types.ObjectId | string) => {
  const leftObjectId = new Types.ObjectId(leftId)
  const rightObjectId = new Types.ObjectId(rightId)
  return leftObjectId.equals(rightObjectId)
}
