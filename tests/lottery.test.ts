/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Messages from '../src/constants/messages'
import * as Models from '../src/models'
import * as TestData from './data/test-data'
import app from '../src/app'
import request from 'supertest'

afterEach(() => {
  jest.clearAllMocks()
})

test('should fetch all tickets', async () => {
  jest.spyOn(Models.Lottery, 'findAll').mockResolvedValueOnce(TestData.validLotteries as any)

  const res = await request(app).get('/ticket')
  const tickets = res.body

  expect(tickets.length).toEqual(3)
  for (let index = 0; index < 3; index += 1) {
    expect(tickets[index].id).toEqual(TestData.validLotteries[index].id)
    expect(tickets[index].statusChecked).toEqual(TestData.validLotteries[index].statusChecked)
  }
})

test('should fetch single ticket', async () => {
  jest.spyOn(Models.Lottery, 'findOne').mockResolvedValueOnce(TestData.validTicketWithLine as any)

  const res = await request(app).get('/ticket/1')
  const ticket = res.body

  expect(Models.Lottery.findOne).toHaveBeenCalled()
  expect(ticket.id).toEqual(TestData.validTicketWithLine.id)
  expect(ticket.statusChecked).toEqual(TestData.validTicketWithLine.statusChecked)
  expect(ticket.Lines.length).toEqual(TestData.validTicketWithLine.Lines.length)
  expect(ticket.Lines[0].numberA).toEqual(TestData.validTicketWithLine.Lines[0].numberA)
  expect(ticket.Lines[0].numberB).toEqual(TestData.validTicketWithLine.Lines[0].numberB)
  expect(ticket.Lines[0].numberC).toEqual(TestData.validTicketWithLine.Lines[0].numberC)
})

test('should not fetch ticket because invalid id given', async () => {
  const res = await request(app).get('/ticket/invalid-id')
  const errorMessage = res.text

  expect(res.statusCode).toEqual(400)
  expect(errorMessage).toEqual(Messages.NO_TICKET_ID_ERROR)
})

test('should not fetch ticket because ticket not found', async () => {
  jest.spyOn(Models.Lottery, 'findOne').mockResolvedValueOnce(null)

  const res = await request(app).get('/ticket/1')
  const errorMessage = res.text

  expect(res.statusCode).toEqual(404)
  expect(errorMessage).toEqual(Messages.LOTTERY_NOT_FOUND_ERROR)
})

test('should create ticket', async () => {
  const mockLotteryModel = {
    toJSON: () => (TestData.validLotteries[0])
  }
  jest.spyOn(Models.Lottery, 'create').mockReturnValueOnce(mockLotteryModel)
  jest.spyOn(Models.Line, 'create')
    .mockReturnValueOnce(TestData.mockLineModel1)
    .mockReturnValueOnce(TestData.mockLineModel2)
  jest.spyOn(global.Math, 'random')
    .mockReturnValueOnce(0)
    .mockReturnValueOnce(1/3)
    .mockReturnValueOnce(2/3)
    .mockReturnValueOnce(0)
    .mockReturnValueOnce(0)
    .mockReturnValueOnce(2/3)

  await request(app)
    .post('/ticket')
    .send({
      lines: 2,
    })

  expect(Models.Lottery.create).toHaveBeenCalledTimes(1)
  expect(Models.Line.create).toHaveBeenNthCalledWith(1, {lotteryId: 1, numberA: 0, numberB: 1, numberC: 2, total: 1})
  expect(Models.Line.create).toHaveBeenNthCalledWith(2, {lotteryId: 1, numberA: 0, numberB: 0, numberC: 2, total: 10})
})

test('should not create ticket because invalid line count', async () => {
  const res1 = await request(app)
    .post('/ticket')
    .send({
      lines: 'invalid-count'
    })
  const errorMessage1 = res1.text
  expect(res1.statusCode).toEqual(400)
  expect(errorMessage1).toEqual(Messages.INVALID_LINE_COUNT_ERROR)

  const res2 = await request(app)
    .post('/ticket')
    .send({
      lines: -10
    })
  const errorMessage2 = res2.text
  expect(res2.statusCode).toEqual(400)
  expect(errorMessage2).toEqual(Messages.INVALID_LINE_COUNT_ERROR)

  const res3 = await request(app)
    .post('/ticket')
    .send()
  const errorMessage3 = res3.text
  expect(res3.statusCode).toEqual(400)
  expect(errorMessage3).toEqual(Messages.INVALID_LINE_COUNT_ERROR)
})

test('should ammend ticket', async () => {
  const mockLotteryModel1 = {
    toJSON: () => (TestData.validTicketWithLine)
  }
  jest.spyOn(Models.Lottery, 'findOne')
    .mockResolvedValueOnce(mockLotteryModel1 as any)
    .mockResolvedValueOnce(TestData.validLotteries[0] as any)
  jest.spyOn(Models.Line, 'create')
    .mockReturnValueOnce(TestData.mockLineModel1)
    .mockReturnValueOnce(TestData.mockLineModel2)
  jest.spyOn(global.Math, 'random')
    .mockReturnValueOnce(0)
    .mockReturnValueOnce(1/3)
    .mockReturnValueOnce(2/3)
    .mockReturnValueOnce(0)
    .mockReturnValueOnce(0)
    .mockReturnValueOnce(2/3)

  await request(app)
    .put('/ticket/1')
    .send({
      lines: 2
    })

  expect(Models.Line.create).toHaveBeenNthCalledWith(1, {lotteryId: 1, numberA: 0, numberB: 1, numberC: 2, total: 1})
  expect(Models.Line.create).toHaveBeenNthCalledWith(2, {lotteryId: 1, numberA: 0, numberB: 0, numberC: 2, total: 10})
})

test('should not ammend ticket because invalid line count', async () => {
  const res = await request(app)
    .put('/ticket/1')
    .send({
      lines: 'invalid-line-count'
    })

  expect(res.statusCode).toEqual(400)
  expect(res.text).toEqual(Messages.INVALID_LINE_COUNT_ERROR)
})

test('should not ammend ticket because invalid line ticket id', async () => {
  const res = await request(app)
    .put('/ticket/invalid-id')
    .send({
      lines: 2
    })

  expect(res.statusCode).toEqual(400)
  expect(res.text).toEqual(Messages.NO_TICKET_ID_ERROR)
})

test('should not ammend ticket because ticket not found', async () => {
  jest.spyOn(Models.Lottery, 'findOne')
    .mockResolvedValueOnce(null)

  const res = await request(app)
    .put('/ticket/1')
    .send({
      lines: 2
    })

  expect(res.statusCode).toEqual(404)
  expect(res.text).toEqual(Messages.LOTTERY_NOT_FOUND_ERROR)
})

test('should not ammend ticket because status has been checked', async () => {
  jest.spyOn(Models.Lottery, 'findOne')
    .mockResolvedValueOnce(TestData.validTicketWithStatusChecked as any)

  const res = await request(app)
    .put('/ticket/1')
    .send({
      lines: 2
    })

  expect(res.statusCode).toEqual(400)
  expect(res.text).toEqual(Messages.CANNOT_AMMEND_TICKET_ERROR)
})

test('should fetch ticket status', async () => {
  jest.spyOn(Models.Lottery, 'findOne')
    .mockResolvedValueOnce(TestData.validTicketWithLine as any)
    .mockResolvedValueOnce(TestData.validTicketWithLineAndTotal as any)
  jest.spyOn(Models.Lottery, 'update').mockResolvedValueOnce(jest.fn() as any)

  const res = await request(app)
    .put('/status/1')
    .send()
  const ticket = res.body

  expect(Models.Lottery.update).toHaveBeenCalledWith({statusChecked: true}, {where: {id: '1'}})
  expect(ticket.id).toEqual(TestData.validTicketWithLineAndTotal.id)
  expect(ticket.Lines.length).toEqual(TestData.validTicketWithLineAndTotal.Lines.length)
  expect(ticket.Lines[0].numberA).toEqual(TestData.validTicketWithLineAndTotal.Lines[0].numberA)
  expect(ticket.Lines[0].numberB).toEqual(TestData.validTicketWithLineAndTotal.Lines[0].numberB)
  expect(ticket.Lines[0].numberC).toEqual(TestData.validTicketWithLineAndTotal.Lines[0].numberC)
  expect(ticket.Lines[0].total).toEqual(TestData.validTicketWithLineAndTotal.Lines[0].total)
})

test('should not fetch ticket status because invalid ticket id', async () => {
  jest.spyOn(Models.Lottery, 'findOne').mockResolvedValueOnce(null)

  const res = await request(app).put('/status/invalid-ticket')
  const errorMessage = res.text

  expect(res.statusCode).toEqual(400)
  expect(errorMessage).toEqual(Messages.NO_TICKET_ID_ERROR)
})

test('should not fetch ticket status because ticket not found', async () => {
  jest.spyOn(Models.Lottery, 'findOne').mockResolvedValueOnce(null)

  const res = await request(app).put('/status/1')
  const errorMessage = res.text

  expect(res.statusCode).toEqual(404)
  expect(errorMessage).toEqual(Messages.LOTTERY_NOT_FOUND_ERROR)
})
