const vscode = require("vscode");
const axios = require("axios");

const updateOrCreatePage = async function retrieveConfluencePages(context) {
  try {
    var accessToken = undefined;

    if (!context.globalState.get("ATLASSIAN_ACCESS_TOKEN")) {
      accessToken = await vscode.window.showInputBox({
        placeHolder: "Access Token",
        prompt: "Paste your Access Token",
      });
      context.globalState.update("ATLASSIAN_ACCESS_TOKEN", accessToken);
    } else {
      accessToken = context.globalState.get("ATLASSIAN_ACCESS_TOKEN");
    }

    if (!accessToken) {
      vscode.window.showErrorMessage("Access token not found. Please log in.");
      return;
    }

    const pages = vscode.workspace.textDocuments.filter((document) =>
      document.fileName.endsWith(".md")
    );
    // Show a quick pick menu with all the pages
    const selectedPage = await vscode.window.showQuickPick(
      pages.map((page) => page.fileName.split("\\").pop().replace(".md", "")),
      {
        placeHolder: "Select a page to push to Confluence",
      }
    );

    const pagesDetails = context.workspaceState.get("pages_details");
    console.log('pagesDetails ' + JSON.stringify(pagesDetails));

    if (!pagesDetails) {
      vscode.window.showErrorMessage(
        "No pages found. Please retrieve pages first."
      );
      return;
    }
    console.log('selectedPage ' + selectedPage);
    if (!selectedPage) {
      return;
    }
    // Check if selected page exists in the pagesDetails dictionary
    if (!pagesDetails[selectedPage]) {
      // Create a new page
      const document = vscode.window.activeTextEditor.document.getText();
      const bodyData = `{
        "type": "page",
        "title": ${selectedPage},
        "space": {
          "key": "TEST"
        },
        "body": {
          "storage": {
            "value": ${document},
            "representation": "storage"
          }
        }
      }`;
      // send the request to create the page with axios
      
    } else {
      // Update a page
      console.log('selectedPage ' + selectedPage + ' ' + pagesDetails[selectedPage]);

      await updateExistingPage(pagesDetails, selectedPage, accessToken);
    }
  } catch (error) {
    vscode.window.showErrorMessage(
      "Error retrieving Confluence pages: " + error
    );
  }
};

async function updateExistingPage(pagesDetails, selectedPage, accessToken) {
  // get data from the editor of name selectedPage
  const document = vscode.window.activeTextEditor.document.getText();
  const cloudId = pagesDetails[selectedPage];
  
  console.log('updateExistingPagecloudId ' + cloudId);

  const bodyData = `{
    "id": ${cloudId},
    "status": "current",
    "title": ${selectedPage},
    "body": {
      "representation": "storage",
      "value": ${document}
    },
    "version": {
      "number": 47,
      "message": "Update content via Dione"
    }
  }`;

  // update the page
  const response = await axios.put(
    `https://api.atlassian.com/ex/confluence/${cloudId}/rest/api/content`,
    bodyData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (response.status === 200) {
    vscode.window.showInformationMessage("Page updated successfully");
  } else {
    vscode.window.showErrorMessage("Error updating page");
  } 
}

module.exports = updateOrCreatePage;
