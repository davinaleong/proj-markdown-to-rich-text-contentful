const dotenv = require("dotenv").config()
const OpenAI = require("openai")

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function generatePrompt(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-3.5-turbo",
    })

    return completion.choices[0]
  } catch (error) {
    console.error(`generatePrompt error: `, error)
  }
}

async function generateContent(post, content = [], separator = "") {
  try {
    let prompt = `Generate a `
    let format = ``
    content.forEach(function ({ title, length }, index) {
      prompt += `${title} in ${length}`
      prompt += index < content.length - 1 ? `, ` : `.`

      format += `${title}: <content> ${separator}`
    })

    prompt += `In the format ${format}.`
    prompt += ` Content: ${post}`

    // console.log(prompt)

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-3.5-turbo",
    })

    return completion.choices[0]
  } catch (error) {
    console.error(`generateContent error: `, error)
  }
}

const openaiLib = {
  openai,
  generatePrompt,
  generateContent,
}

module.exports = openai
