/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/login.js ***!
  \**********************/
var signupLink = document.getElementById("signupLink");
var loginLink = document.getElementById("loginLink");
var loginForm = document.getElementById("login");
var signupForm = document.getElementById("signUp");
signupLink.addEventListener("click", function () {
  console.log("clicked");
  loginForm.setAttribute("style", "display:none");
  signupLink.setAttribute("style", "display:none");
  signupForm.setAttribute("style", "display:block");
  loginLink.setAttribute("style", "display:block");
});
loginLink.addEventListener("click", function () {
  signupForm.setAttribute("style", "display:none");
  loginLink.setAttribute("style", "display:none");
  loginForm.setAttribute("style", "display:block");
  signupLink.setAttribute("style", "display:block");
});
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wcm9qZWN0My8uL3NyYy9sb2dpbi5qcyJdLCJuYW1lcyI6WyJzaWdudXBMaW5rIiwiZG9jdW1lbnQiLCJsb2dpbkxpbmsiLCJsb2dpbkZvcm0iLCJzaWdudXBGb3JtIiwiY29uc29sZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxJQUFNQSxVQUFVLEdBQUdDLFFBQVEsQ0FBUkEsZUFBbkIsWUFBbUJBLENBQW5CO0FBQ0EsSUFBTUMsU0FBUyxHQUFHRCxRQUFRLENBQVJBLGVBQWxCLFdBQWtCQSxDQUFsQjtBQUNBLElBQU1FLFNBQVMsR0FBR0YsUUFBUSxDQUFSQSxlQUFsQixPQUFrQkEsQ0FBbEI7QUFDQSxJQUFNRyxVQUFVLEdBQUdILFFBQVEsQ0FBUkEsZUFBbkIsUUFBbUJBLENBQW5CO0FBQ0FELFVBQVUsQ0FBVkEsMEJBQXFDLFlBQU07QUFDekNLLFNBQU8sQ0FBUEE7QUFDQUYsV0FBUyxDQUFUQTtBQUNBSCxZQUFVLENBQVZBO0FBQ0FJLFlBQVUsQ0FBVkE7QUFDQUYsV0FBUyxDQUFUQTtBQUxGRjtBQU9BRSxTQUFTLENBQVRBLDBCQUFvQyxZQUFNO0FBQ3hDRSxZQUFVLENBQVZBO0FBQ0FGLFdBQVMsQ0FBVEE7QUFDQUMsV0FBUyxDQUFUQTtBQUNBSCxZQUFVLENBQVZBO0FBSkZFLEciLCJmaWxlIjoibG9naW4tZjNiNzAzNDJhNmNiNTQyNmI4MWMuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgc2lnbnVwTGluayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2lnbnVwTGlua1wiKTtcbmNvbnN0IGxvZ2luTGluayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9naW5MaW5rXCIpO1xuY29uc3QgbG9naW5Gb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpblwiKTtcbmNvbnN0IHNpZ251cEZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNpZ25VcFwiKTtcbnNpZ251cExpbmsuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgY29uc29sZS5sb2coXCJjbGlja2VkXCIpO1xuICBsb2dpbkZvcm0uc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJkaXNwbGF5Om5vbmVcIik7XG4gIHNpZ251cExpbmsuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJkaXNwbGF5Om5vbmVcIik7XG4gIHNpZ251cEZvcm0uc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJkaXNwbGF5OmJsb2NrXCIpO1xuICBsb2dpbkxpbmsuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJkaXNwbGF5OmJsb2NrXCIpO1xufSk7XG5sb2dpbkxpbmsuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgc2lnbnVwRm9ybS5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBcImRpc3BsYXk6bm9uZVwiKTtcbiAgbG9naW5MaW5rLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIFwiZGlzcGxheTpub25lXCIpO1xuICBsb2dpbkZvcm0uc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJkaXNwbGF5OmJsb2NrXCIpO1xuICBzaWdudXBMaW5rLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIFwiZGlzcGxheTpibG9ja1wiKTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==