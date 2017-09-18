const dotenv = require('dotenv');

if (!Object.prototype.hasOwnProperty.call(process.env, 'REQUIRE_DOT_ENV') || process.env.REQUIRE_DOT_ENV === 'true') {
  dotenv.config({ path: './2018/.env' });
}
