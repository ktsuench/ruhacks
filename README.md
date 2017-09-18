# RU Hacks 

RU Hacks 2018 Official Website. Visit it at [https://www.ruhacks.com/](https://www.ruhacks.com/ "RU Hacks 2018")!

## Contributing

Try to commit all your changes at the end of the day. It gets messy when the day ends and you forget what you were doing. _Tends to happen to Kent, so trying to avoid that from happening again._

### Requirements

- Node 8.5.x with npm 5.x.x
- 
  MongoDB 3.4.9

  _Used for the 2018 website_
- 
  PostgreSQL 9.5.4 (using PGC)

  _Only if you are maintaining 2017 website_

### Recommended Setup

- Visual Studio Code (with following extensions)
  - ESLint
  - Git Blame
- Learn how to debug NodeJS code in Visual Studio Code
- Learn how to use `git` in Visual Studio Code

### Running Local Copy

- Before running `node start`, startup the MongoDB first by running `mongod`
- 
  Run `node start` to start the server

  _If you don't have PostgreSQL installed, then in the `server.js` file comment out line `18`!_
- 
  Run `node test` to run the tests

  _Currently only the database tests are written. They still need to be expanded._
- Run `node lint` to lint your code, unless you're using the recommended setup above.

### Deploying to Production

- Will expand later _maybe_...