import * as Helpers from '../helpers'
import * as Messages from '../constants/messages'
import { Request, Response } from 'express'
import { Lottery } from '../models'

export const fetchTickets = async (_: Request, res: Response) => {
  const lotteries = await Lottery.findAll()
  return res.send(lotteries)
}

export const fetchTicket = async (req: Request, res: Response) => {
  const { id } = req.params

  if (!id || Number.isNaN(parseInt(id, 10))) {
    return res.status(400).send(Messages.NO_TICKET_ID_ERROR)
  }

  const lottery = await Helpers.getLottery(id)

  if (!lottery) {
    return res.status(404).send(Messages.LOTTERY_NOT_FOUND_ERROR)
  }

  return res.send(lottery)
}

export const createTicket = async (req: Request, res: Response) => {
  const params = req.body

  if (!params) {
    return res.status(400).send(Messages.NO_LINE_COUNT_ERROR)
  }

  const noOfLines = parseInt(req.body.lines, 10)

  if (isNaN(noOfLines) || noOfLines <=0) {
    return res.status(400).send(Messages.INVALID_LINE_COUNT_ERROR)
  }

  const lottery = await Lottery.create()
  const newLottery = lottery.toJSON()

  await Helpers.createNewLinesForLottery(noOfLines, newLottery.id)

  return res.status(201).send(newLottery)
}

export const ammendTicket = async (req: Request, res: Response) => {
  const { id } = req.params

  if (!id || Number.isNaN(parseInt(id, 10))) {
    return res.status(400).send(Messages.NO_TICKET_ID_ERROR)
  }

  const params = req.body

  if (!params) {
    return res.status(400).send(Messages.NO_LINE_COUNT_ERROR)
  }

  const noOfLines = parseInt(req.body.lines, 10)

  if (isNaN(noOfLines) || noOfLines <=0) {
    return res.status(400).send(Messages.INVALID_LINE_COUNT_ERROR)
  }

  const lotteryModel = await Lottery.findOne({ where: { id } })

  if (!lotteryModel) {
    return res.status(404).send(Messages.LOTTERY_NOT_FOUND_ERROR)
  }

  const lottery = lotteryModel.toJSON()

  if (lottery.statusChecked) {
    return res.status(400).send(Messages.CANNOT_AMMEND_TICKET_ERROR)
  }

  await Helpers.createNewLinesForLottery(noOfLines, parseInt(id, 10))

  const updatedLottery = await Helpers.getLottery(id)

  return res.status(200).send(updatedLottery)
}

export const fetchTicketStatus = async (req: Request, res: Response) => {
  const { id } = req.params

  if (!id || Number.isNaN(parseInt(id, 10))) {
    return res.status(400).send(Messages.NO_TICKET_ID_ERROR)
  }

  const lottery = await Helpers.getLottery(id)

  if (!lottery) {
    return res.status(404).send(Messages.LOTTERY_NOT_FOUND_ERROR)
  }

  await Lottery.update({ statusChecked: true }, { where: { id }})

  const updatedLottery = await Helpers.getLottery(id, true)

  return res.send(updatedLottery)
}
