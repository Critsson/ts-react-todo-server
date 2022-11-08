const app = require("./app")
const handler = require("serverless-express/handler")

module.exports.handler = handler(app)
