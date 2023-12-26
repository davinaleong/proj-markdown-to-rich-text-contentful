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

async function migratePost(postId) {
  try {
    const post = await prisma.posts.findFirst({ where: { id: postId } })

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

    const richText = richTextFromMarkdown(text, richTextOptions)

    // Fetch space and environment
    const space = await client.getSpace(envVars.spaceId)
    const environment = await space.getEnvironment(envVars.environmentId)

    // Fetch content type (uncomment and verify)
    const contentType = await environment.getContentType(contentTypeIds.posts)
    contentType.fields.body = richText.content // Update content type field (if needed)
    await contentType.update()

    const entryData = {
      fields: {
        title: { "en-US": title },
        slug: { "en-US": slug },
        subtitle: { "en-US": subtitle },
        excerpt: { "en-US": summary },
        body: { "en-US": richText },
        // Add other fields as needed
      },
    }

    const entry = await space.createEntry(contentTypeIds.posts, entryData)
    console.log("Entry created successfully:", entry)
  } catch (error) {
    console.error("Error migrating post:", error)
  }
}

// Example usage:
migratePost(1) // Migrate post with ID 1
