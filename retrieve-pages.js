const vscode = require("vscode");
const axios = require("axios");

const retrieveConfluencePages = async function retrieveConfluencePages(context) {
  try {
    var accessToken = undefined;

    if (!context.globalState.get('ATLASSIAN_ACCESS_TOKEN')) {
        accessToken = await vscode.window.showInputBox({
        placeHolder: "Access Token",
        prompt: "Paste your Access Token",
        });
        context.globalState.update('ATLASSIAN_ACCESS_TOKEN', accessToken);
    } else {
        accessToken = context.globalState.get('ATLASSIAN_ACCESS_TOKEN');
    }

    // console.log("accessToken " + accessToken);

    if (!accessToken) {
      vscode.window.showErrorMessage("Access token not found. Please log in.");
      return;
    }

    const cloudResponse = await axios.get(
      "https://api.atlassian.com/oauth/token/accessible-resources",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );

    let pagesTitles = "</br></br>";
    cloudResponse.data.forEach((element) => {
      pagesTitles += element.name + "</br>";
      console.log("element " + element.id);
    });
    console.log("=============================");

    const cloudId = cloudResponse.data[0].id;
    // vscode.ExtensionContext.globalState.update('ATLASSIAN_ACCESS_TOKEN', accessToken);

    const responseContent = await axios.get(
      `https://api.atlassian.com/ex/confluence/${cloudId}/rest/api/content?limit=2`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );

    // console.log("responseContent " + JSON.stringify(responseContent.data));
    const resultsId = responseContent.data.results[0].id;

    console.log("resultsId " + resultsId);

    const contentRes = await axios.get(
        `https://api.atlassian.com/ex/confluence/${cloudId}/rest/api/content/${resultsId}?expand=body.storage`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        }
      );

    // console.log("contentRes " + JSON.stringify(contentRes.data));
    // const panel = vscode.window.createWebviewPanel(
    //     'webPanelId', // Unique ID for your panel
    //     'Page Title', // Title displayed in the UI
    //     vscode.ViewColumn.Beside, // Open in the side panel
    //     {
    //         enableScripts: true, // Enable JavaScript in the webview
    //     }
    // );
    
    // panel.webview.html = contentRes.data.body.storage.value;

    const content = contentRes.data.body.storage.value;

    vscode.workspace.openTextDocument({ language: 'markdown' }).then((document) => {
        const edit = new vscode.WorkspaceEdit();
        edit.insert(document.uri, new vscode.Position(0, 0), content);

        // Apply the edit and show the document in a webview panel on the right side
        vscode.workspace.applyEdit(edit).then(() => {
            vscode.window.showTextDocument(document, vscode.ViewColumn.Beside);
        });
    });
    
    vscode.window.showInformationMessage(
      `Retrieved ${responseContent.data.length} Confluence pages.`
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      "Error retrieving Confluence pages: " + error
    );
  }
};

module.exports = retrieveConfluencePages;
