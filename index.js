const { PrismaClient } = require("@prisma/client")
const contentful = require("contentful-management")
const { richTextFromMarkdown } = require("@contentful/rich-text-from-markdown")
const { BLOCKS } = require("@contentful/rich-text-types")
const { logFunction, logValue } = require("./lib/helpers.lib")
const { envVars, contentTypeIds } = require("./lib/contentful.lib")

const client = contentful.createClient({
  accessToken: envVars.accessToken,
})

const prisma = new PrismaClient()

prisma.posts
  .findFirst({ where: { id: 1 } })
  .then((post) => {
    const {
      title,
      slug,
      subtitle,
      summary,
      text,
      featured,
      status,
      published_at,
    } = post
    // console.log("post", post)

    const richTextOptions = {
      renderNode: {
        [BLOCKS.PARAGRAPH]: (node, next) => {
          return {
            nodeType: "paragraph",
            content: next(node.content),
          }
        },
      },
    }

    const richText = richTextFromMarkdown(text, richTextOptions)

    // This API call will request a space with the specified ID
    client.getSpace(envVars.spaceId).then((space) => {
      // This API call will request an environment with the specified ID
      space.getEnvironment(envVars.environmentId).then((environment) => {
        // let's get a content type
        environment.getContentType(contentTypeIds.posts).then((contentType) => {
          // console.log("post > environment", title)
          // console.log("contentType", contentType)

          // and now let's update its name
          contentType.fields.title = title
          contentType.fields.slug = slug
          contentType.fields.excerpt = summary
          contentType.fields.subtitle = subtitle
          contentType.fields.body = richText.content

          contentType.create()

          // contentType.update().then((updatedContentType) => {
          //   console.log("updatedContentType", updatedContentType)
          //   console.log("Update was successful")
          // })
        })
      })
    })
  })
  .catch((error) => console.error(error))
