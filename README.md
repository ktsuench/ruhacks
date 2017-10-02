# RU Hacks 

RU Hacks 2018 Official Website. Visit it at [https://www.ruhacks.com/](https://www.ruhacks.com/ "RU Hacks 2018")!

## Releases

- `v1.0.0` - 2017 (up to and during 2017 hackathon)
- `v1.0.1` - 2017 LTS (after 2017 hackathon)
- `v2.1.1` - 2018 (current) and upcoming

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
  - Git Lens or Git Blame
    - Git Lens is better (more features)
- Learn how to debug NodeJS code in Visual Studio Code
- Learn how to use `git` in Visual Studio Code

### Running Local Copy

- Before running `npm start`, do the following:
  - startup MongoDB by running `mongod`
  - startup PostgreSQL DB running `pgc`
- 
  Run `npm start` to start the server

  _If you don't have PostgreSQL installed, then in the `server.js` file comment out line `18`!_
- 
  Run `npm test` to run the tests

  _Currently only the database tests are written. They still need to be expanded._
- Run `npm run lint` to lint your code, unless you're using the recommended setup above.

### Deploying to Production

- Will expand later _maybe_...