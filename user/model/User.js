/**
 * @module userDB
 * @desc this module is the interface for the database. It contains
 * CRUD methods in SQL to talk to the database.
 * Each function returns a promise
 */

// TODO: [1] require pg-promise, and execute it like a function.
// TODO: [2] require our DB config
const pgp      = require('pg-promise')({
  query: q => console.log(q.query),
});

const dbConfig = require('../../config/dbConfig');


// execute pgp with our db config, so a connection is made.
// @see https://github.com/vitaly-t/pg-promise#query-result-mask
const db = pgp(dbConfig);

// export our collection of functions as a function
module.exports = {
  /**
   * @func findAll
   * @desc search through all the users
   * @returns {Promise}
   * @hint this
   */
  findAll() {
    return db.many(`
      SELECT *
        FROM users
    ORDER BY id
    `);
  },

  findOne(username) {
    return db.one(`
      SELECT *
        FROM users
       WHERE username = $1
    `, username);
  },


  /**
   * @func findById
   * @param id {number} the ID of the user to search for
   * @desc search through the users and find by an ID
   * @returns {Promise}
   */
  findById(id) {
    return db.one(`
      SELECT *
        FROM users
       WHERE email = $1
    `, id);
  },

  /* upsert = (insert or update) */
  save(user) {
    return db.one(`
      INSERT INTO users (
        username, password_digest, email, firstname, lastname, avatar
      ) VALUES (
        $/username/, $/password_digest/, $/email/, $/firstname/, $/lastname/, $/avatar/
      )
      ON CONFLICT (username) DO UPDATE
      SET
        username        = $/username/,
        password_digest = $/password_digest/,
        email           = $/email/,
        firstname       = $/firstname/,
        lastname        = $/lastname/,
        avatar          = $/avatar/
      RETURNING *
    `, user);
  },

  update(user) {
    return db.one(`
      UPDATE users
      SET
      content = $/content/,
      author = $/author/,
      genre_type = $/genre_type/
      WHERE id = $/id/
      RETURNING *
    `, user);
  },

  /**
   * Removes one user from DB
   * @param {number} id - the id of a user
   * @returns {Promise}
   */
  destroy(id) {
    return db.none(`
      DELETE
        FROM users
       WHERE id = $1
    `, id);
  },
};
