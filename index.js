const { PrismaClient } = require("@prisma/client")
const { logFunction, logValue } = require("./helpers")

const prisma = new PrismaClient()

async function main() {
  logFunction(`main`)

  const postOne = await prisma.posts.findFirst({ where: { id: 1 } })
  logValue(`postOne`, postOne)
}

main()
