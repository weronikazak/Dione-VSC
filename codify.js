const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function codify() {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
        const selection = `
<code>
${editor.document.getText(editor.selection)}
</code>`;
        
        if (editor.document.getText(editor.selection)) {
            // You can customize the file path and name here
            const newFileName = 'selectedText.md';
            const newFilePath = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, newFileName);
            
            fs.writeFileSync(newFilePath, selection);
            vscode.workspace.openTextDocument(newFilePath).then(doc => {
                vscode.window.showTextDocument(doc);
            });
        }
    }
};

module.exports = codify;