const signupLink = document.getElementById("signupLink");
const loginLink = document.getElementById("loginLink");
const loginForm = document.getElementById("login");
const signupForm = document.getElementById("signUp");
signupLink.addEventListener("click", () => {
  console.log("clicked");
  loginForm.setAttribute("style", "display:none");
  signupLink.setAttribute("style", "display:none");
  signupForm.setAttribute("style", "display:block");
  loginLink.setAttribute("style", "display:block");
});
loginLink.addEventListener("click", () => {
  signupForm.setAttribute("style", "display:none");
  loginLink.setAttribute("style", "display:none");
  loginForm.setAttribute("style", "display:block");
  signupLink.setAttribute("style", "display:block");
});
