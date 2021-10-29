/*--------------------------------------------------------------------------------------------*/
const cookieSession = require('cookie-session');
const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { findUserByEmail, emailLookUp, urlsForUser } = require('./helpers');
/*--------------------------------------------------------------------------------------------*/
app.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge: 24 * 60 * 60 * 1000
  })
);
/*---------------------------------------------------------------------------------------------*/
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
/*--------------------[Generates the Tiny URL and User ID]------------------------------------*/
const generateRandomString = function() {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
/*-----------------------------[Users Database Object]-----------------------------------------*/
const users = {
  userRandomID: {
    id: 'userRandomID',
    email: 'user@example.com',
    password: 'purple-monkey-dinosaur'
  },
  user2RandomID: {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: 'dishwasher-funk'
  }
};
/*------------------------------[URL Database]-------------------------------------------------*/
const urlDatabase = {
  b2xVn2: { longURL: 'http://www.lighthouselabs.ca', userId: 'aJ48LW' },
  '9sm5xK': { longURL: 'http://google.com', userId: 'aJ48LW' }
};
/*-------------------------------[GET Routes]--------------------------------------------------*/

app.get('/register', (req, res) => {
  let userId = req.session.user_id;
  let templateVars = {
    urls: urlDatabase,
    user: users[userId]
  };
  res.render('urls_register', templateVars);
});
/*---------------------------------------------------------------------------------------------*/
app.get('/', (req, res) => {
  res.redirect('/register');
});
/*---------------------------------------------------------------------------------------------*/
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});
/*---------------------------------------------------------------------------------------------*/
app.get('/hello', (req, res) => {
  let userId = req.session.user_id;
  let templateVars = {
    user: users[userId],
    greeting: 'Hello World!'
  };
  res.render('Hello_World', templateVars);
});
/*---------------------------------------------------------------------------------------------*/
app.get('/urls', (req, res) => {
  if (req.session.user_id) {
    const key = req.session.user_id;
    const userUrls = urlsForUser(key, urlDatabase);
    let templateVars = {
      user: users[key],
      urls: userUrls
    };
    res.render('urls_index', templateVars);
  } else {
    res.redirect('/login');
  }
});
/*---------------------------------------------------------------------------------------------*/
app.get('/urls/new', (req, res) => {
  let userId = req.session.user_id;
  if (userId === undefined) {
    res.redirect('/login');
  } else {
    let templateVars = {
      user: users[userId]
    };
    res.render('urls_new', templateVars);
  }
});
/*---------------------------------------------------------------------------------------------*/

app.get('/login', (req, res) => {
  let userId = req.session.user_id;
  let templateVars = {
    user: users[userId]
  };
  res.render('urls_login', templateVars);
});
/*---------------------------------------------------------------------------------------------*/

app.get('/urls/:shortURL', (req, res) => {
  let templateVars = {
    user: users[req.session.user_id],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]['longURL']
  };
  res.render('urls_show', templateVars);
});
/* ---------------------------------------------------------------------------------------------*/
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]['longURL'];
  const key = req.params.shortURL;
  res.redirect(longURL);
});
/*-------------------------------[POST Routes]---------------------------------------------------*/

app.post('/urls', (req, res) => {
  if (req.session.user_id) {
    let shortURL = generateRandomString();
    urlDatabase[shortURL] = {
      longURL: req.body['longURL'],
      userId: req.session.user_id
    };
    res.redirect(`/urls/${shortURL}`);
  } else {
    res.redirect(403, '/urls');
  }
});
/*----------------------------------------------------------------------------------------------*/

app.post('/urls/:shortURL/delete', (req, res) => {
  if (urlDatabase[req.params.shortURL].userId === req.session.user_id) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  } else {
    res.status(403).send("ah ah ah , you didn't say the magic word...");
  }
});
/*------------------------[Short URLs Link accessible to anyone]---------------------------------*/

app.post('/urls/:id', (req, res) => {
  const shortURL = req.params.id;
  urlDatabase[shortURL].longURL = req.body.longURL;
  res.redirect('/urls');
});
/*----------------------------------------------------------------------------------------------*/
app.post('/login', (req, res) => {
  if (!emailLookUp(req.body.email, users)) {
    res.status(403).send('Invalid request');
  } else if (!req.body.email || !req.body.password) {
    res.redirect(403, '/login');
  } else {
    const user = findUserByEmail(req.body.email, users);
    if (bcrypt.compareSync(req.body.password, user['password'])) {
      req.session.user_id = user.id;
      res.redirect('/urls');
    } else {
      res.status(403).send('The user name/password is incorrect');
    }
  }
});
/*-----------------------------------------------------------------------------------------------*/

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});
/*-----------------------------------------------------------------------------------------------*/
app.post('/register', (req, res) => {
  if (emailLookUp(req.body.email)) {
    res.redirect(400, '/register');
  } else if (!req.body.email) {
    res.redirect(400, '/register');
  } else if (!req.body.password) {
    res.redirect(400, '/register');
  } else {
    const newUser = generateRandomString();
    users[newUser] = {
      id: newUser,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    };
    req.session.user_id = newUser;
    res.redirect('/urls');
  }
});
/*------------------------------------------------------------------------------------------------*/
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
/*------------------------------------------------------------------------------------------------*/

module.exports = { users };