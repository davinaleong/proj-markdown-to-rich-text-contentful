function logFunction(name, params = {}) {
  console.log(`fn ${name}:(${JSON.stringify(params)})`)
}

function logValue(name, value) {
  console.log(name, value)
}

const helpers = {
  logFunction,
  logValue,
}

module.exports = helpers
