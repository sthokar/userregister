const util = require('util');
const fs = require('fs');
const bcrypt = require('bcrypt');

const User   = require('../user/model/User');

const readFile = util.promisify(fs.readFile);

readFile('./db/users.csv', 'utf8')
  .then((data) => {
    const lines = data.trim().split('\n');
    // pop off the header row and the empty bottom row
    lines.shift();
    // loop over and insert the users into the db
    return Promise.all(lines.map(async (record) => {
      // destructure the record once we've split the row
      const [firstname, lastname, username, email, avatar, password] = record.split(',');

      // hash a password
      const pwdHash  = await bcrypt.hash(password, 11);

      return User.save({
        username,
        email,
        firstname,
        lastname,
        avatar,
        password_digest: pwdHash,
      });
    }));
  })
  .then(data => console.log({data}))
  .catch(err => console.error({err}))

