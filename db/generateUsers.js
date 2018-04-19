#!/usr/bin/env node
const faker = require('faker');

const count = +process.argv[2] || 5;

/**
 * Dynamic fake user generator
 * @desc node script to generate random users into CSV format; pipes to stout
 * @author Jason Seminara <js@ga.co>
 * @since 2018-04-16
 * @example ./generateUsers.js 20 > users.csv
 */


/**
 * @func makeUser
 * @desc spit out an array of headings or an array of values
 */
function makeUser(i) {
  return (i === 0) ? [
    'firstname',
    'lastname',
    'username',
    'email',
    'avatar',
    'password',
  ] : [
    faker.name.firstName(),
    faker.name.lastName(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.avatar(),
    faker.lorem.word(),
  ];
}

// add one more to the count for the heading
const users = Array(count + 1).fill(0)
  /* map over, make a user and join the results */
  .map((e, i) => makeUser(i).join(','));



// spit out the results with line breaks separating the records
console.log(users.join('\n'));
