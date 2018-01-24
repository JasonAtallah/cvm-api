const fs = require('fs');
const path = require('path');
const envJsonPath = path.resolve(__dirname, 'env.json');

if (fs.existsSync(envJsonPath)) {
  module.exports = require(envJsonPath);
} else {
  module.exports = {
    API_HOST: process.env.TEST_API_HOST
  }
}
