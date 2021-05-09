const createError = require('http-errors')
const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const app = express()
const indexRouter = require('./routes/index')
const apiRouter = require('./routes/api')
const allowedOrigins = ['http://localhost:1337', 'https://pennystreams.com', 'https://pennystreams.herokuapp.com'];
require('dotenv').config()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified origin :(';
      return callback(new Error(msg), false);
    } return callback(null, true);
  },
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.text())
app.use(bodyParser.urlencoded({ extended: false }))

//= =====ROUTES=============
app.use('/', indexRouter)
app.use('/api/', apiRouter)

/* GET redirect page. */
app.get('/*', function(req, res, next) {
  res.redirect('/');
});

//= =====================================
//= ===========ERROR HANDLERS============
//= =====================================

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

const port = 1337

app.listen(port, () => {
  console.log(`🚀 Listening on Port ${port}!`)
  console.log(path.join(__dirname, 'views'))
})

module.exports = app