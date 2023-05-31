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

  let res = await fetch(`${baseUrl}user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });

  if (res.ok) {
    const token = await res.json();
    localStorage.setItem("token", token.token);
    alert("Login Successfull");
    window.location.href = "dashboard.html";
  }
}
