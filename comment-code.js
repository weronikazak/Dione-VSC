const vscode = require('vscode');
const OpenAI = require('openai');

async function commentCode(code) {

    try {
        const openai = new OpenAI({
            apiKey: "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",
        });

        const commentedCode = await openai.chat.completions.create({
            messages: [{ role: "user", content: `Explain in short words this code: ${code}` }],
            model: "gpt-3.5-turbo",
        });
        // console.log("commentedCode " + commentedCode.choices[0].message.content);
        return commentedCode.choices[0].message.content;
    } catch (error) {
        vscode.window.showErrorMessage("OpenAI Error: " + error.message);
    }
    
}

module.exports = commentCode;