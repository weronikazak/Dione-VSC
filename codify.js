const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const commentCode = require("./comment-code");
const retrieveConfluencePages = require("./retrieve-pages");

async function codify(context) {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const selection = editor.document.getText(editor.selection);
    if (!selection.trim()) {
      vscode.window.showInformationMessage("No text selected");
      return;
    }
  } else {
    vscode.window.showInformationMessage("You must open a file to codify");
    return;
  }
  
  var apiKey = await context.globalState.get("OPENAI_API_KEY");

  if (!apiKey) {
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
    } else {
      apiKey = openApi;
      context.globalState.update("OPENAI_API_KEY", apiKey);
    }
  }

  // Open a new document or retrieve pages
  const options = [
    "Create new page",
    "Retrieve existing page",
    "Use existing page",
  ];
  const selectedOption = await vscode.window.showQuickPick(options, {
    placeholder:
      "Would you like to retrieve an existing page or create a new one?",
  });

  if (!selectedOption) {
    return;
  }

  if (selectedOption === "Create new page") {
    await createNewPage(apiKey);
  } else if (selectedOption === "Use existing page") {
    await useExistingPage(apiKey);
  } else {
    await reusePage(apiKey, context);
  }
  return;
}

async function useExistingPage(apiKey) {
  // List existing files that end with .md
  const files = fs.readdirSync(vscode.workspace.workspaceFolders[0].uri.fsPath);
  const markdownFiles = files.filter((file) => file.endsWith(".md"));
  // Show a quick pick menu with the list of files
  const selectedFile = await vscode.window.showQuickPick(markdownFiles, {
    placeHolder: "Select a file",
  });
  if (!selectedFile) {
    return;
  }
  // Open the file
  const filePath = path.join(
    vscode.workspace.workspaceFolders[0].uri.fsPath,
    selectedFile
  );
  await pasteTheCode(apiKey, filePath);
}

async function reusePage(apiKey, context) {
  const selectedOption = await retrieveConfluencePages(context);
  if (!selectedOption) {
    return;
  }
  const selectedPage = selectedOption.pageTitle;
  // // Save the page title and cloud ID to the global state
  const filePath = path.join(
    vscode.workspace.workspaceFolders[0].uri.fsPath,
    selectedPage + ".md"
  );
  await pasteTheCode(apiKey, filePath);
}

async function createNewPage(apiKey) {
  const editorName = await vscode.window.showInputBox({
    prompt: "Enter the title for the document",
    placeHolder: "Enter the title for the document",
  });

  if (!editorName) {
    return;
  }

  // Create a new page with the title on the right side of the screen
  const filePath = path.join(
    vscode.workspace.workspaceFolders[0].uri.fsPath,
    editorName + ".md"
  );

  await pasteTheCode(apiKey, filePath);
}

async function pasteTheCode(apiKey, filePath) {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const selection = editor.document.getText(editor.selection);
    const commentedCode = await commentCode(apiKey, selection);
    const snippet = `
<table><tr><td><pre><code>
${selection}
</code></pre></td></tr></table>
<p>${commentedCode}</p>
`;

    // check if the file exists and if it doesn't, create it
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, snippet);
      vscode.workspace.openTextDocument(filePath).then((document) => {
        const edit = new vscode.WorkspaceEdit();

        vscode.workspace.applyEdit(edit).then(() => {
          vscode.window.showTextDocument(document, vscode.ViewColumn.Beside);
        });
      });
    } else {
      // Paste the snippet into the editor
      vscode.workspace.openTextDocument(filePath).then((doc) => {
        const edit = new vscode.WorkspaceEdit();
        // insert the snippet at the end of the file
        edit.insert(doc.uri, new vscode.Position(doc.lineCount, 0), snippet);
        vscode.workspace.applyEdit(edit).then(() => {
          vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
        });
      });
    }
  }
}

module.exports = codify;
