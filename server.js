require('dotenv').config();
const express      = require('express');
const logger       = require('morgan');
const path         = require('path');
const bodyParser = require('body-parser');
const session      = require('express-session');
const authService = require('./user/auth/AuthService');
const authRouter = require('./user/auth/AuthRouter');
// const userViewController = require('./user/model/User');

// start express
const app = express();
const PORT = process.env.PORT || 3000;

app.set('superSecret', process.env.Server_Secret);
app.set('view engine', 'ejs');

// some logging
app.use(logger('dev'));

app.use(session({
  secret:            app.get('superSecret'),
  resave:            false,
  saveUninitialized: false,
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

/* THIS IS A PRIVATE ROUTE */
app.get('/myHome', (req, res) => {
  res.json(req.session);
});

// ROUTE HANDLER

app.use('/auth',authRouter);

app.get('/',(req,res) =>{
  res.status(404).render('welcome',{message:'This is a pubic page'})
})

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).send('Something broke!');
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server up and listening on port ${PORT}, in ${app.get('env')} mode.`);
}).on('error', console.error);

