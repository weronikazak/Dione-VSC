const vscode = require("vscode");
const OpenAI = require("openai");
const { OPENAI_API_KEY } = require("./globals");

async function commentCode(code) {
  try {
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });

    const commentedCode = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You will be provided with a piece of code, and your task is to explain it in a concise way.`,
        },
        {
          role: "user",
          content: `${code}`,
        },
      ],
      model: "gpt-4",
      temperature: 0,
      max_tokens: 1024,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    // console.log("commentedCode " + commentedCode.choices[0].message.content);
    return commentedCode.choices[0].message.content;
  } catch (error) {
    vscode.window.showErrorMessage("OpenAI Error: " + error.message);
  }
}

module.exports = commentCode;
