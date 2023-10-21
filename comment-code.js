const vscode = require("vscode");
const OpenAI = require("openai");

async function commentCode(OPENAI_API_KEY, code) {
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
      model: "gpt-3.5-turbo",
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
