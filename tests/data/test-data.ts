export const validLotteries = [
  {
    id: 1,
    statusChecked: false
  },
  {
    id: 2,
    statusChecked: true
  },
  {
    id: 3,
    statusChecked: false
  },
]

export const mockLineModel1 = {
  toJSON: () => ({
    numberA: 0,
    numberB: 1,
    numberC: 2,
    total: 1
  })
}
export const mockLineModel2 = {
  toJSON: () => ({
    numberA: 0,
    numberB: 0,
    numberC: 2,
    total: 10
  })
}

export const validTicketWithLine = {
  Lines: [
    {
      numberA: 0,
      numberB: 0,
      numberC: 1
    }
  ],
  id: 1,
  statusChecked: false
}

export const validTicketWithLineAndTotal = {
  Lines: [
    {
      numberA: 0,
      numberB: 0,
      numberC: 1,
      total: 0
    }
  ],
  id: 1,
  statusChecked: false
}

export const validTicketWithStatusChecked = {
  toJSON: () => ({
    Lines: [
      {
        numberA: 0,
        numberB: 0,
        numberC: 1,
        total: 0
      }
    ],
    id: 1,
    statusChecked: true
  })
}
