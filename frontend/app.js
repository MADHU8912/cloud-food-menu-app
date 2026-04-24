fetch("/api/restaurants")
  .then(res => res.json())
  .then(data => {
    document.getElementById("restaurants").innerHTML =
      JSON.stringify(data);
  })
  .catch(err => console.log(err));