const { PrismaClient } = require("@prisma/client")
const contentful = require("contentful-management")
const { richTextFromMarkdown } = require("@contentful/rich-text-from-markdown")
const { BLOCKS } = require("@contentful/rich-text-types")
const { envVars, contentTypeIds } = require("./lib/contentful.lib")

const client = contentful.createClient({
  accessToken: envVars.accessToken,
})

const prisma = new PrismaClient()

// Enhanced rich text handling
const richTextOptions = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, next) => ({
      nodeType: "paragraph",
      content: next(node.content),
    }),
    // Add other Markdown element handlers as needed
  },
}

async function migratePost(from, to) {
  try {
    const posts = await prisma.posts.findMany({
      where: {
        id: {
          gte: from,
        },
      },
      take: to,
    }) // Fetch 5 posts

    for (const post of posts) {
      const {
        id,
        title,
        slug,
        subtitle,
        summary,
        text,
        featured,
        status,
        published_at,
      } = post

      // const richText = richTextFromMarkdown(text, richTextOptions)

      // Fetch space and environment
      const space = await client.getSpace(envVars.spaceId)
      const environment = await space.getEnvironment(envVars.environmentId)

      const entryData = {
        fields: {
          title: { "en-US": title },
          slug: { "en-US": slug },
          subtitle: { "en-US": subtitle },
          excerpt: { "en-US": summary },
          body: { "en-US": text },
          featured: { "en-US": featured === true },
          publishedAt: { "en-US": published_at },
        },
      }

      // Create the entry
      const entry = await environment.createEntry(
        contentTypeIds.posts,
        entryData
      )
      await entry.publish()
      console.log("Entry created: ", id, title)
    } // for
  } catch (error) {
    console.error(`Failed to migrate posts: ${error.message}`)
  }
}

migratePost(0, 5)
