const fs = require("fs")
const { Location, ReturnType, CodeLanguage } = require("@chainlink/functions-toolkit")
const { scrutateurJeton } = require("./Croupier.js")

// Configure the request by setting the fields below
const requestConfig = {
  // String containing the source code to be executed
  // source: fs.readFileSync("./C_Scrutateur.js").toString(),
  source: fs.readFileSync("./Croupier_Manuel.js").toString(),
  //source: fs.readFileSync("./API-request-example.js").toString(),
  // Location of source code (only Inline is currently supported)
  codeLocation: Location.Inline,
  // Optional. Secrets can be accessed within the source code with `secrets.varName` (ie: secrets.apiKey). The secrets object can only contain string values.
  secrets: { apiKey: process.env.COINMARKETCAP_API_KEY ?? "" },
  // Optional if secrets are expected in the sourceLocation of secrets (only Remote or DONHosted is supported)
  secretsLocation: Location.DONHosted,
  // Args (string only array) can be accessed within the source code with `args[index]` (ie: args[0]).
  // args: ["1", "bitcoin", "btc-bitcoin", "btc", "1000000", "450"],
  args: [scrutateurJeton.toString()],
  // args: ["123", "456", "789", "1011"],
  // Code language (only JavaScript is currently supported)
  codeLanguage: CodeLanguage.JavaScript,
  // Expected type of the returned value
  // expectedReturnType: ReturnType.uint256,
  expectedReturnType: ReturnType.string,
}

module.exports = requestConfig
