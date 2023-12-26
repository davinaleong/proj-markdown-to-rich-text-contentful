const _ = require("lodash")
const { PrismaClient } = require("@prisma/client")
const { richTextFromMarkdown } = require("@contentful/rich-text-from-markdown")
const { logFunction, logValue } = require("./lib/helpers.lib")

const prisma = new PrismaClient()

async function main() {
  const { text } = await prisma.posts.findFirst({ where: { id: 1 } })
  const richText = await richTextFromMarkdown(text)
  logValue(`richText`, richText)
}

main()
