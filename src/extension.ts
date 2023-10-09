import * as vscode from 'vscode';
const axios = require('axios');

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "dione" is now active!');

    let disposable = vscode.commands.registerCommand('dione.editCode', () => {
        // Create a new untitled Markdown document
        vscode.workspace.openTextDocument({ language: 'markdown' }).then((document) => {
            vscode.window.showTextDocument(document, vscode.ViewColumn.Beside);
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
