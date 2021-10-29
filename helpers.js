const findUserByEmail = function (email,users) {
  for (user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
return false;
};

const emailLookUp = function (email,users) {
  for (user in users) {
    if (users[user].email === email) {
      return true;
    }
  };
  return false;
 };
 function urlsForUser(id, urlDatabase){
  let result = {}
  for (key in urlDatabase) {
     if (urlDatabase[key].userId === id) {
       result[key] = urlDatabase[key]
    }   
  }
  return result
};

module.exports = { findUserByEmail, emailLookUp, urlsForUser };