function logFunction(name, params = {}) {
  console.log(`fn ${name}:(${JSON.stringify(params)})`)
}

function logValue(name, value) {
  console.log(name, value)
}

const helperLib = {
  logFunction,
  logValue,
}

module.exports = helperLib
