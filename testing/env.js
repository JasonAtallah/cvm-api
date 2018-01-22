const fs = require('fs');
const path = require('path');
const envJsonPath = path.resolve(__dirname, 'env.json');

if (fs.existsSync(envJsonPath)) {
  module.exports = require(envJsonPath);
} else {
  module.exports = {
    API_HOST: process.env.TEST_API_HOST,
    BUYER_ID: process.env.TEST_BUYER_ID,
    VENDOR_ID: process.env.TEST_VENDOR_ID,
    QID: process.env.TEST_QID
  }
}
