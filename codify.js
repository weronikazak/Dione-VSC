const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const commentCode = require('./comment-code');
require('dotenv').config();

async function codify() {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
        const selection = editor.document.getText(editor.selection);
        

        if (selection.trim()) {
            const codeExplanation = await commentCode(selection);
            const snippet = `

<code>
${selection}
</code>

${codeExplanation}`;

            const baseFileName  = 'Confluence: New Document.md';
            const baseFilePath = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, baseFileName);
            
            const openDocuments = vscode.workspace.textDocuments;
            const existingFile = openDocuments.find(doc => doc.fileName.includes("Confluence: "));
            
            if (existingFile) {
                // File is already open, append the selection
                vscode.workspace.openTextDocument(existingFile.uri).then(doc => {
                    const edit = new vscode.WorkspaceEdit();
                    edit.insert(doc.uri, new vscode.Position(existingFile.lineCount, 0), snippet);
                    vscode.workspace.applyEdit(edit).then(() => {
                        vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
                    });
                });

            } else {
                // File doesn't exist or is not open, create a new one
                fs.writeFileSync(baseFilePath, snippet);
                vscode.workspace.openTextDocument(baseFilePath).then(doc => {
                    vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
                });
            }
        }
    }
};

module.exports = codify;