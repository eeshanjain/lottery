import { DataTypes } from 'sequelize'
import sequelize from '../db'

const Line = sequelize.define('Line', {
  lotteryId: {
    type: DataTypes.INTEGER
  },
  numberA: {
    allowNull: false,
    type: DataTypes.INTEGER,
    validate: {
      max: 2,
      min: 0
    }
  },
  numberB: {
    allowNull: false,
    type: DataTypes.INTEGER,
    validate: {
      max: 2,
      min: 0
    }
  },
  numberC: {
    allowNull: false,
    type: DataTypes.INTEGER,
    validate: {
      max: 2,
      min: 0
    }
  },
  total: {
    type: DataTypes.INTEGER,
    validate: {
      isIn: {
        args:[[ 0, 1, 5, 10 ]],
        msg: 'Invalid calculation of the total'
      }
    }
  }
}, {
  timestamps: false
})

export default Line
