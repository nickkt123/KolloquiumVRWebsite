const express = require('express')
var bodyParser = require('body-parser')
// Create express instance
const app = express()

// Require API routes
const users = require('./routes/users')
const kolloquiums = require('./routes/kolloquiums')

// Import API Routes

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(users)
app.use(kolloquiums)
// Export express app
module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${port}`)
  })
}
