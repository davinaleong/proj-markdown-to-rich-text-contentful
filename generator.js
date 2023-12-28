const dotenv = require("dotenv").config()
const OpenAI = require("openai")

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const WORDS = `words`
const CHARACTERS = `characters`

// async function generateContent(
//   post,
//   separator = "`",
//   lengths = {
//     title: `5 words`,
//     metaDescription: `20 words`,
//     excerpt: `50 words`,
//     googleTags: `100 characters`,
//   }
// ) {
//   const { title, metaDescription, excerpt, googleTags } = lengths
//   const prompt = `Generate a title in ${title}, a meta description in ${metaDescription}, an excerpt in ${excerpt}, and comma separared Google tags in ${googleTags}. Add a separator for each content so that it's easy to split in code. Content: ${post}`

//   const completion = await openai.chat.completions.create({
//     messages: [{ role: "system", content: prompt }],
//     model: "gpt-3.5-turbo",
//   })

//   console.log(completion.choices[0])
// }

async function generateContent(post, content = [], separator = "") {
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

  console.log(completion.choices[0])
}

const post = `Hi, have 2 testimonies to share. One is on weight loss, and the other is on a prayer answered.

I have been overweight since young and have struggled to lose weight. I have tried everything from slimming to dieting. I’ve even tried Pastor Mark’s method too of visualisation. I would lose weight fast during those periods (10 - 20kg) but would gain it back when I stopped.

Last year, I felt led to take my weight loss journey restfully--trusting the Lord to do the supernatural. I stopped focusing on the numbers on the scale and counting calories.

On Friday, my mum sent me a photo of some nice clothes she saw while shopping and asked me if I wanted to try them. Yesterday, we went to the shop and they didn’t have size XL or 14. So I took 12. When I tried the clothes on, I found out that they fit me well! Wow! Without effort I am now down one more size! So from 18 to 14 to 12. And this was an effortless journey! Thank You, Lord for helping my lose weight supernaturally!

The second testimony was on bringing people to church. The people I normally share the gospel with was with the people around me. It started with muslim colleagues, and now includes my trainer and an Indian free-thinker. Recently, I just decided to ask my trainer and colleague (and good friend) if they wanted to come for our CG Christmas party. Since it was held at my place, I made it sound like I was arranging it. To my surprise, they agreed to come, and also contribute to the gift exchange! Wow! Thank You, Jesus for answering my prayer and heart’s desire. I declare they shall be blessed and will enjoy themselves!!!`

content = [
  {
    title: "Title",
    length: `5 ${WORDS}`,
  },
  {
    title: "Meta Description",
    length: `50 ${WORDS}`,
  },
  {
    title: "Excerpt",
    length: `50 ${WORDS}`,
  },
  {
    title: "Comma separated google tags",
    length: `100 ${CHARACTERS}`,
  },
]

generateContent(post, content, `----------`)
