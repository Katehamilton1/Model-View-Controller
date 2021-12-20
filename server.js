const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path');

const helpers = require('./utils/helpers');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({ helpers });

const session = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Initialize sessions
const sess = {
    secret:"secret",
    cookie:{ 
        // Session will automatically expire in 10 minutes
        expires: 10 * 60 * 1000},
    resave: true,
    rolling: true,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize
    })
  };

// Inform Express.js on which template engine to use
  app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes)


sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
  });
