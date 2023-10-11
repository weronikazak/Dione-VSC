const vscode = require('vscode');
const fs = require('fs');
const path = require('path');


function codify() {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
        const selection = editor.document.getText(editor.selection);
        const snippet = `
<code>
${selection}
</code>`;

        if (selection.trim()) {
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