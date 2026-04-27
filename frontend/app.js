function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("/api/login", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.token) {
      document.getElementById("status").innerText = "Login Successful ✅";
      loadRestaurants();
    } else {
      document.getElementById("status").innerText = "Login Failed ❌";
    }
  });
}

function loadRestaurants() {
  fetch("/api/restaurants")
    .then(res => res.json())
    .then(data => {
      let html = "";
      data.forEach(r => {
        html += `<div class="card">
          <h3>${r.name}</h3>
          <p>⭐ ${r.rating}</p>
        </div>`;
      });
      document.getElementById("restaurants").innerHTML = html;
    });
}