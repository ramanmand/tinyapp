const { assert } = require('chai');
const { findUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('#findUserByEmail', () => {
  it('should return "userRandomID"', function() {

    const user = findUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    console.log(user.id);
    assert.deepEqual(expectedOutput,user.id);
  });
  it(`should return "undefined"`, function() {
        
    const user = findUserByEmail("test@test.com", testUsers);
    const expectedOutput = undefined;
    assert.deepEqual(expectedOutput,user.id);
  });
});
