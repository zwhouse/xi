# ξ &nbsp; [![Build Status](https://travis-ci.org/bkiers/xi.png)](https://travis-ci.org/bkiers/xi)

Play correspondence Chinese Chess (**Xi**angqi): [play-xi.herokuapp.com](https://play-xi.herokuapp.com)

### Local development

 - install and run [PostgreSQL](https://www.postgresql.org/download)
 - create a database (for example `xi`)
 - copy `.env.example` to `.env` and set the environment variables inside properly (`SENDGRID_API_KEY` is optional)
 - run all migrations: `npm run mig:run`
 - start the app by doing `npm start`

### Unit tests

Unit are run by doing `npm test`

### Migrations

After making changes to a database model, run `npm run mig:gen MIGRATION_NAME` and afterwards run `npm run mig:run`
to apply the changes to your local database.

### Deploying

Every change to `master` is built by [TravisCI](https://travis-ci.org/bkiers/xi) and when all unit tests pass, `master`
will automatically be deployed on Heroku.