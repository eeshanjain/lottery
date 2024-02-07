import { Line, Lottery } from '../models'
import { getNewLine } from './lottery'

export const createNewLinesForLottery = async (noOfLines: number, lotteryId: number) => {
  const linesPromises = []

  for (let num = 0; num < noOfLines; num += 1) {
    const line = getNewLine()

    linesPromises.push(Line.create({lotteryId, ...line}))
  }

  await Promise.all(linesPromises)
}

export const getLottery = async (id: string, fetchTotal = false) => {
  const attributes = ['numberA', 'numberB', 'numberC']

  if (fetchTotal) {
    attributes.push('total')
  }

  const lottery = await Lottery.findOne({
    include: [{
      attributes,
      model: Line
    }],
    where: {
      id
    }
  })
  return lottery
}