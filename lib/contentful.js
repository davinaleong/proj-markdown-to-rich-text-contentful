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

const client = contentful.createClient({ accessToken })
const space = client ? await client.getSpace({ spaceId }) : null
const environment = space ? await space.getEnvironment({ environmentId }) : null

const contentTypeIds = {
  jokes,
  posts,
  subscribers,
}

const contentfulLib = {
  client,
  space,
  environment,
  contentTypeIds,
}

module.exports = contentfulLib
