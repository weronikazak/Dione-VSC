# Dione - A Visual Studio Extension

## Prerequisites:

- Your Atlassian [Personal Access Token (PAT)](https://confluence.atlassian.com/enterprise/using-personal-access-tokens-1026032365.html)
- [Your OpenAI API key](https://platform.openai.com/account/api-keys)

## Getting Started with Dione:

1. Begin by installing the extension from the [marketplace](https://marketplace.visualstudio.com/items?itemName=dione.dione).

2. Press ``ctrl + shift + P``. Search for ***Dione: Save Credentials***. Ensure you have your Confluence Token on hand. **Remember to enter the email you use for Atlassian login**. If you've set this up before, there's no need to repeat.

3. Again, press `ctrl + shift + P` and search for ***Dione: Login***. This action will redirect you to an external site, granting Dione remote access to your Confluence workspace.

4. Press `ctrl + shift + P` and search for ***Dione: List Pages***. From here, select the page you'd like to view in your editor. By default, the page will be displayed in Markdown format.

5. In a separate tab, highlight the code snippet you wish to document. Right-click and select ***Dione: Codify*** from the dropdown. Feel free to repeat this step as needed.

6. Once satisfied with your modifications, press `ctrl + shift + P` one last time and opt for ***Dione: Push Pages***. You should now see your updates reflected in Confluence.

## Command Descriptions:

- ***Dione: Login***: This command fetches your Atlassian Access Token, enabling remote access. Once authorized, you'll be directed to a page displaying your Access Token. Make sure to copy this token and paste it when prompted, like when using *Dione: Codify* or *Dione: List Pages*. This step is a one-time requirement.

- ***Dione: Save Credentials***: Here, you can store your Confluence email and Personal API Token (PAT). **Note that this is different from the Access Token above and you have to [create it yourself](https://confluence.atlassian.com/enterprise/using-personal-access-tokens-1026032365.html)!**

- ***Dione: List Pages***: This command pulls all the Confluence pages linked to your account and shows them in markdown format.

- ***Dione: Codify***: This feature employs AI to document any highlighted code. On your first use, you'll be prompted to enter your **[OpenAI key](https://platform.openai.com/account/api-keys)**. Subsequently, you'll be asked if you'd like to create a new document or append the code snippet to an existing one.

- ***Dione: Push Pages***: Once you've made changes to the code, use this command to upload it to your Confluence server.

**Spotted an issue? [Report it here.](https://github.com/weronikazak/Dione-VSC)**