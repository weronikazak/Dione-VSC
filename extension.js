// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const retrieveConfluencePages = require('./retrieve-pages');


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

function generateUID() {
	// I generate the UID from two parts here
	// to ensure the random number provide enough bits.
	var firstPart = (Math.random() * 46656) | 0;
	var secondPart = (Math.random() * 46656) | 0;
	firstPart = parseInt(("000" + firstPart.toString(36)).slice(-3));
	secondPart = parseInt(("000" + secondPart.toString(36)).slice(-3));
	return firstPart.toString() + secondPart.toString();
}

function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "dione" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('dione.authenticate', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		const YOUR_USER_BOUND_VALUE = generateUID();
		const authorizationUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=ORuHfUtA7BUvMeNwMNz1hYQX0s8ZPh8w&scope=write%3Aconfluence-content%20search%3Aconfluence%20read%3Aconfluence-content.all&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fcallback%2F&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent`;

		// Open the URL in an external browser
		vscode.env.openExternal(vscode.Uri.parse(authorizationUrl)).then((response) => {
			console.log('response ' + response);
		});
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(vscode.commands.registerCommand('dione.listPages', retrieveConfluencePages, context));
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
