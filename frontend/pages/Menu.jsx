import { useEffect, useState } from "react";
import API from "../services/api";
import { useCart } from "../context/CartContext";

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    const res = await API.get("/menu");
    setMenu(res.data);
  };

  return (
    <div>
      <h1>🍔 Menu</h1>

      {menu.map((item) => (
        <div key={item._id} style={{ border: "1px solid gray", margin: 10 }}>
          <h3>{item.name}</h3>
          <p>₹{item.price}</p>

          <button onClick={() => addToCart(item)}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}