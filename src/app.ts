import 'dotenv/config'

import * as Handlers from './handlers/lottery'
import express from 'express'
import sequelize from './db'

const app = express()
const port = process.env.PORT

app.use(express.json())

app.get('/', (_, res) => {
  res.send('Hey there! Why not try some of the APIs? :D')
})

/**
 * Fetch all tickets
 */
app.get('/ticket', Handlers.fetchTickets)

/**
 * Fetch ticket specified by ID
 */
app.get('/ticket/:id', Handlers.fetchTicket)

/**
 * Create a new ticket
 */
app.post('/ticket', Handlers.createTicket)

/**
 * Ammed the ticket specified by the ID
 */
app.put('/ticket/:id', Handlers.ammendTicket)

/**
 * Fetch the status of the ticket
 */
app.put('/status/:id', Handlers.fetchTicketStatus)

sequelize.authenticate().then(() => {
  /* eslint-disable no-console */
  app.listen(port, () => { console.log(`Express is listening at http://localhost:${port}`) })
  /* eslint-enable no-console */
})

export default app
