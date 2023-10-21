const loginButton = document.getElementById("saveButton");
const messageDiv = document.getElementById("message");

loginButton.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const tokenApi = document.getElementById("tokenApi").value;

    if (email && tokenApi) {
        messageDiv.innerText = `Logged in as ${email}`;
    } else {
        messageDiv.innerText = "Please enter a email and token api.";
    }
});
