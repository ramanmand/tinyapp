const lookUpEmail = function(email,users) {
  for (let user in users) {
    if (users[user].email === email) {
      return true;
    }
  }
  return false;
};

const lookUpPswrd = function(password,users) {
  for (let i in users) {
    if (users[i].password === password) {
      return true;
    }
  }
  return false;
};

const findUserByEmail = function(email,users) {
  for (let user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return;
};
  // eslint-disable-next-line func-style
function urlsForUser(id, urlDatabase)  {
  let result = {};
  for (let urls in urlDatabase) {
    if (urlDatabase[urls].userId === id) {
      result[urls] = urlDatabase[urls];
    }
  }
  return result;
}
module.exports = { findUserByEmail, lookUpEmail, urlsForUser, lookUpPswrd };