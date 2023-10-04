const dotenv = require("dotenv").config()
const contentful = require("contentful-management")

const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
const spaceId = process.env.CONTENTFUL_SPACE_ID
const environmentId = process.env.CONTENTFUL_ENVIRONMENT_ID

const jokes = "jokes"
const posts = "posts"
const subscribers = "subscribers"

// const client = contentful.createClient({
//   space: spaceId,
//   accessToken,
// })

// const client = contentful.createClient({ accessToken })
// const space = client.getSpace({ spaceId })
// console.log(`client`, client, `space`, space)
// const environment = space.getEnvironment({ environmentId })

async function client() {
  return contentful.createClient({ accessToken })
}

async function space() {
  const thisClient = await client()
  return thisClient.getSpace({ spaceId })
}

async function environment() {
  const thisSpace = await space()
  return thisSpace.getEnvironment({ environmentId })
}

const envVars = {
  accessToken,
  spaceId,
  environmentId,
}

const contentTypeIds = {
  jokes,
  posts,
  subscribers,
}

const contentfulLib = {
  client,
  space,
  environment,
  envVars,
  contentTypeIds,
}

module.exports = contentfulLib
