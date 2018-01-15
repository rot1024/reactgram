const path = require("path");

module.exports = {
  settings: {
    "import/resolver": {
      webpack: {
        config: {
          resolve: {
            alias: {
              reactgram: path.resolve(__dirname, "../../src")
            }
          }
        }
      }
    }
  },
  rules: {
    "import/no-unresolved": 2,
    "node/no-missing-import": 0
  }
};
