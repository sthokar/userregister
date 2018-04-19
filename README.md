# Express Auth (with Sessions)

### Learning Objectives
- _Explain Authentication and Authorization and their role in building web apps_
- _Describe what a session is and how to make a new one_
- _Use express-session to implement auth in an Express app_
- _Describe hashing and use bcrypt to secure user passwords_


## Intro: Who are you and what are you allowed to do?

> You go to a bank to withdraw some money for a fancy dinner you've planned for tonight.  Making your way to the front of the line, the teller asks for either a driver's license or an ATM card.  You present your license and ask to make a withdrawal from a checking account with a number which you (quietly) read to the teller.  The helpful teller checks to make sure that there are sufficient funds in the account and that you are allowed access to the account, and finally hands you the money.  You win.

What's going on in the above anecdote?  Perhaps without noticing it, we've just seen how the two participants enacted a particular authentication and authorization policy.  First, the teller requested that the account holder *prove they are who they say they are*.  Next, the account holder made a request for a particular action, viz., to withdraw funds from a particular account.  The teller checks to make sure that the person the account holder purports to be is authorized to make that particular request, i.e., they are an account holder or something similar for that account.  There's also a side step about sufficient funds, which is arguably a piece of the auth puzzle, but not something we'll worry too much about here.  

Further, there's another (minor) step in the process when the account holder first walks in and is presents as a "guest" to the bank.  Such a state could be described as *stranger danger*, but could also be thought of as *the public*.  Both connotations have their own utility; *stranger danger* I shouldn't trust someone to perform certain actions until I can verify who they are, but on the other hand I have to present some mechanism for randos to get to know me before I ask them to hand over potentially private and sensitive pieces of verifying information, e.g., a driver's license.


>In community, the individual is, crucial as the prior condition for forming a community. … Every individual in the community guarantees the community; the public is a chimera, numerality is everything…

> — Søren Kierkegaard, Journals

Ouch.  Public interfaces are a necessary piece of any modern web app, or else how could users be _authenticated_, but the work of individuating members of the public into verified users and then appropriately _authorizing_ them to perform a known set of operations pays dividends.

### Authentication vs Authorization
Are you who you say you are?  Prior to being a _known user_ a guest account or public user must be treated as an anonymous, unknown person.  After submitting some private information that only that person would know, do we treat a user as a particular user in our system.  

If we give particular privileges to some users and not others, e.g., an admin user can reset any other user's password, then we say that some users are *authorized* to perform particular actions while others have not been so *authorized*.

## How do we authenticate a User in a web app?
There are two pieces to the authentication puzzle in web apps.  First, we could have a user tell us a password and a unique username, and then ask them to give us the password again any time they want to log in to the app.  Unfortunately, since HTTP is a _stateless_ communication protocol, any individual request has no immediate relation to any other request.  Thus, all requests, at least initially, must be treated as coming anonymous public guest users.

![stranger danger](assets/download.jpg)

If a particular request is received, e.g., a `POST` request with a valid `username` and `password` in the request body, we could then verify or _authenticate_ that particular request as coming from a verified user.  But, given the current scheme, that would require every request be a `POST` with those same fields for any request to be _authenticated_.  
And that dog just isn't gonna hunt.

### Give me a cookie
![cookie](assets/cookie.jpg)

To amend our requests and make them stateful, we can attach a cookie to each request.  The browser handles cookies under the hood.  For now, just now that response headers from a server can set cookies, and the browser can optionally include them in subsequent requests made to a particular domain.  A cookie is an encoded bit of information including a *timestamp*, a *domain name* from the issuing site, and optionall some other public info.  In theory, no one should be able to read the data inside a cookie except the issuing website, but in practice this doesn't really hold.  So don't put a user's Social Security # or other crucial info in cookies.

### A workflow
Briefly described, here's a basic workflow of session-based authentication using cookies in an example express app.  A user goes to `mywonderfulmemeapp.com` and sees a helpful landing page.  The user clicks on a link to add a new meme to the meme collection.  The server receives the request, and looks to see if there is an authorization cookie attached to the request.  Having not found a cookie (or an invalid one), the server redirects the user to a login page.  The user fills out their username and password and hits submit.  A `POST` request  is sent to the server with the username and password in the request body, and the server verifies that the username exists, and that the password is correct (more on this momentarily).  Then, using the `express-session` middleware, the server attaches a cookie to the response which includes identifying information about the user as well as an expiration date and information about the above domain name.  The user is redirected to the create meme page, where they successfully fill out the relevant form, submit another `POST` request, this time with the auth cookie attached.  The `express-session` middleware inspects the cookie, validates it, and then passes on the request to the create meme handler.

You win!

#### A Note on passwords
As you may have guessed.  Passwords and cookies act a bit like golden keys.  Once someone has one, they can pretty much do anything that particular user is authorized to do.  We can clear out a session--either by forcing the cookie to expire, or deleting information on the server by which we're tracking the session--but we can't really delete someone's password.

But can't we just tell them we accidentally leaked their password and then make them pick a new one?  Well, not really.

One issue is that despite being told not to, most users still use the same password for almost everything.  So if one place leaks it, their accounts elsewhere could be compromised.  Second, what if we don't know our systems are breached and a password stolen?  The only real solution is to not store a user's password in the first place.  But then how can we remember what was each time a user wants to login?

## Hashing and Encryption
What's the difference?  We can both `encrypt` and `unencrypt` a particular piece of information.  But have you ever heard someone talk about `un-hashing`?  _probably not_.

From the venerable _wikipedia_:
> In cryptography, encryption is the process of encoding a message or information in such a way that only authorized parties can access it and those who are not authorized cannot. Encryption does not itself prevent interference, but denies the intelligible content to a would-be interceptor.

So encryption is akin to a secret message that can be encoded and decoded at some later date.  We could encrypt a user's password, but then we would still have to decode it and keep either one in a database.  In the event of a system breach, an attacker could probably gain access both to the encoded password and whatever means we have for decoding it, thus throwing us back in the original conundrum.

Now, we come to the magic of one-way functions, in this case also known as "cryptographic hash functions".
One way to think about it is if I took a piece of paper, wrote down my password on it, and then in a very specific order, tore the paper into a determined number of pieces, burned some subset of the pieces, then tore a determined number of those pieces, and maybe dropped them in soda.  The result would be a mess, bear little resemblance to the original piece of paper and message, but importantly, _if I repeat the exact same process to another piece of paper with the same message I would get the exact same kind of mess_, thereby ensuring that the first message was identical to the second, even though I only remember the shape of the resulting mass after applying this very detailed and thorough method of destroying it.

### Behold

```javascript
> const bcrypt = require('bcrypt')
undefined
> const password = 'my secret'
undefined
> const password_digest = bcrypt.hashSync(password, 11)
undefined
> bcrypt.compareSync('not the right password', password_digest)
false
> bcrypt.compareSync('my secret', password_digest)
true
```
So make ensure to hash your user's passwords into a `password_digest` and store that in the DB.

## All Done!
![meeseeks](assets/meeseeks.png)




## References
- http://expressjs-book.com/index.html%3Fp=128.html
