// TODO [1] bcrypt
// TODO [2] user model
const bcrypt = require('bcrypt');
const User   = require('../model/User');

module.exports = {
  /**
   * @func login
   * @desc compares the cleartext password with the hashed version in the DB
   */
  // login(req, res, next) {
    // debugger;
    // one way
//     const {username,password} =req.body;
//     User.findOne(username)
//       .then((user) =>{
//         return [user, bcrypt.compare(password, user.password_digest)];
// })
//       .then(([user,validPass]) =>{
//     if(!validPass){
//         throw { message: "Incorrect Password"};
//     }
//    req.session.user = user;
//    next();
// })

//       .catch((err) =>{
//         next(err);
//       });
//     },


//another way
// const {username,password} =req.body;
//     User.findOne(username)
//       .then( async (user) =>{
//         const isValidPass = await bcrypt.compare(password, user.password_digest)
// })
//     if(!validPass){
//         throw { message: "Incorrect Password"};
//     }
//    req.session.user = user;
//    next();
// // })

//       .catch((err) =>{
//         next(err);
//       })
//     },


//another way
async login(req,res,next){
  try{
const {username,password} =req.body;
const user = await User.findone(username);
const isValidPass = await bcrypt.compare(password, user.password_digest);
    if(!validPass){
        throw { message: "Incorrect Password"};
    }
   req.session.user = user;
   next();

}
 catch(err){
        next(err);
      }
},


  /**
   * @func logout
   * @description destroys a user's session; logs a user out;
   */
  logout(req, res, next) {
    // destroy session
    // next will be called with either an error or undefined.
    // (negative or positive path)
    req.session.destroy(err => next(err));
    // .then((data) => {

    // })

  },

  /**
   * @hint: this is an array of middleware functions
   */
  loginRequired: [
    /* this is either going to resolve to next(false) or next(null) */
    (req, res, next) => next(!req.session.user || null),
    (err, req, res, next) => res.sendStatus(401),
  ],
};
