import Line from './line'
import Lottery from './lottery'
import sequelize from '../db'

Lottery.hasMany(Line, { foreignKey: 'lotteryId' })

sequelize.sync()

export { Lottery, Line }
