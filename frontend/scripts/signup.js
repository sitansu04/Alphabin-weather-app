const baseUrl = "https://alphabin-weather-app.cyclic.app/";
document.querySelector("#submit").addEventListener("click", loginfunc);

async function loginfunc(e) {
  e.preventDefault();

  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  let obj = {
    email,
    password,
  };

  let res = await fetch(`${baseUrl}user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });

  if (res.ok) {
    alert("Signup Successfull, Please try to login");
    window.location.href = "index.html";
  }
}
