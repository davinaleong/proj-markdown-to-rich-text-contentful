const _ = require("lodash")
const { PrismaClient } = require("@prisma/client")
const { richTextFromMarkdown } = require("@contentful/rich-text-from-markdown")
const { environment, contentTypeIds } = require("./lib/contentful")
const { logFunction, logValue } = require("./lib/helpers")

const prisma = new PrismaClient()

async function main() {
  logFunction(`main`)

  const {
    title,
    slug,
    subtitle,
    summary,
    text,
    featured,
    status,
    published_at,
  } = await prisma.posts.findFirst({ where: { id: 1 } })
  //   const richText = await richTextFromMarkdown(text)
  //   logValue(`richText`, richText)
  await client.entry.create({
    contentTypeId: contentTypeIds.posts,
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
      // body: await richTextFromMarkdown(text),
      publishedAt: published_at,
      featured: featured === true,
    },
  })
}

main()
