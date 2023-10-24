const vscode = require("vscode");

const saveCredentials = async function retrieveConfluencePages(context) {
  // show a message box to the user to enter the email
  const email = await vscode.window.showInputBox({
    placeHolder: "Enter your email",
    prompt: "Enter your email",
  });

  if (!email) {
    return;
  }

  const apiToken = await vscode.window.showInputBox({
    placeHolder: "Enter your api token",
    prompt: "Enter your api token",
  });

  if (!apiToken) {
    // create an error message with buttons to external website
    vscode.window.showInformationMessage(
      "You must enter your API token",
      ...["Docs", "Get API Token"]
    ).then((selection) => {
      if (selection === "Get API Token") {
        vscode.env.openExternal(vscode.Uri.parse("https://id.atlassian.com/manage-profile/security/api-tokens"));
      } else if (selection === "Docs") {
        vscode.env.openExternal(vscode.Uri.parse("https://confluence.atlassian.com/cloud/api-tokens-938839638.html"));
      }
    });
    return;
  }

  const openApi = await vscode.window.showInputBox({
    placeHolder: "Enter your OpenAI API key",
    prompt: "Enter your  OpenAI API key",
  });

  if (!openApi) {
    // create an error message with buttons to external website
    vscode.window.showInformationMessage(
      "You must enter your Open API token",
      ...["Get API Token"]
    ).then((selection) => {
      if (selection === "Get API Token") {
        vscode.env.openExternal(vscode.Uri.parse("https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key"));
      }
    });
    return;
  }
  
  context.globalState.update("EMAIL", email);
  context.globalState.update("API_TOKEN", apiToken);
  context.globalState.update("OPENAI_API_KEY", openApi);

  vscode.window.showInformationMessage("Credentials saved successfully!");
};

module.exports = saveCredentials;
