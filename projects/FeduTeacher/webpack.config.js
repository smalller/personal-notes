/* eslint-disable */
const path = require("path");

module.exports = {
  output: {
    path: path.join(__dirname, "./dist"),
    filename: "js/[name].[hash].js",
  },
};
