const { PrismaClient } = require("@prisma/client")
const { envVars } = require("contentful-management")
const { richTextFromMarkdown } = require("@contentful/rich-text-from-markdown")
const { logFunction, logValue } = require("./lib/helpers.lib")
const { logFunction, logValue } = require("./lib/helpers.lib")
const { contentTypeIds } = require("./lib/contentful.lib")

const prisma = new PrismaClient()

const { title, slug, subtitle, summary, text, featured, status, published_at } =
  prisma.posts.findFirst({ where: { id: 1 } })

const richText = richTextFromMarkdown(text)
logValue(`richText`, richText)

const client = contentful.createClient({
  accessToken: envVars.accessToken,
})

const entry = {
  fields: {
    title: {
      "en-US": title,
    },
    slug: {
      "en-US": slug,
    },
    excerpt: {
      "en-US": summary,
    },
    subtitle: {
      "en-US": subtitle,
    },
    body: {
      "en-US": richText,
    },
    featured: {
      "en-US": featured === true,
    },
  },
}

client
  .getSpace(envVars.spaceId)
  .then((space) => space.getEnvironment(envVars.environmentId))
  .then((environment) => environment.createEntryWithId(contentTypeIds.posts), {
    fields: {
      title: {
        "en-us": title,
      },
      slug: {
        "en-us": slug,
      },
    },
  })
