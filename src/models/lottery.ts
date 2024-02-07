import { DataTypes } from 'sequelize'
import sequelize from '../db'

const Lottery = sequelize.define('Lottery', {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  statusChecked: {
    defaultValue: false,
    type: DataTypes.BOOLEAN
  }
}, {
  timestamps: false
})

export default Lottery
