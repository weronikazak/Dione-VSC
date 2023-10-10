const vscode = require('vscode');
const retrieveConfluencePages = require('./retrieve-pages');

/**
 * @param {vscode.ExtensionContext} context
 */

function generateUID() {
	var firstPart = (Math.random() * 46656) | 0;
	var secondPart = (Math.random() * 46656) | 0;
	firstPart = parseInt(("000" + firstPart.toString(36)).slice(-3));
	secondPart = parseInt(("000" + secondPart.toString(36)).slice(-3));
	return firstPart.toString() + secondPart.toString();
}

function activate(context) {

	console.log('Congratulations, your extension "dione" is now active!');

	let disposable = vscode.commands.registerCommand('dione.authenticate', function () {

		const YOUR_USER_BOUND_VALUE = generateUID();
		const authorizationUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=ORuHfUtA7BUvMeNwMNz1hYQX0s8ZPh8w&scope=write%3Aconfluence-content%20read%3Aconfluence-space.summary%20write%3Aconfluence-space%20write%3Aconfluence-file%20read%3Aconfluence-props%20write%3Aconfluence-props%20manage%3Aconfluence-configuration%20read%3Aconfluence-content.all%20read%3Aconfluence-content.summary%20search%3Aconfluence%20read%3Aconfluence-content.permission%20read%3Aconfluence-user%20read%3Aconfluence-groups%20write%3Aconfluence-groups%20readonly%3Acontent.attachment%3Aconfluence&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fcallback%2F&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent`;

		vscode.env.openExternal(vscode.Uri.parse(authorizationUrl)).then((response) => {
			console.log('response ' + response);
		});
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(vscode.commands.registerCommand('dione.listPages', retrieveConfluencePages, context));
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
