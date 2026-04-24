fetch("/api/restaurants")
  .then(res => res.json())
  .then(restaurants => {
    const box = document.getElementById("restaurants");

    restaurants.forEach(r => {
      box.innerHTML += `
        <div class="card">
          <img src="${r.image}" alt="${r.name}">
          <h2>${r.name}</h2>
          <p>📍 ${r.location}</p>
          <p>⭐ ${r.rating}</p>
          <button onclick="showMenu(${r.id})">View Menu</button>
        </div>
      `;
    });
  });

function showMenu(id) {
  fetch(`/api/restaurants/${id}`)
    .then(res => res.json())
    .then(r => {
      const menu = document.getElementById("menu");
      menu.innerHTML = `<h2>${r.name} Menu</h2>`;

      r.menu.forEach(item => {
        menu.innerHTML += `<p>${item.item} - ₹${item.price}</p>`;
      });
    });
}