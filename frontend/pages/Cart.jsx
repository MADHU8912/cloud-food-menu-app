import { useCart } from "../context/CartContext";
import API from "../services/api";

export default function Cart() {
  const { cart, removeFromCart, total } = useCart();

  const placeOrder = async () => {
    await API.post("/orders", {
      items: cart,
      totalAmount: total,
    });

    alert("Order Placed ✅");
  };

  return (
    <div>
      <h1>🛒 Cart</h1>

      {cart.map((item) => (
        <div key={item._id}>
          {item.name} - ₹{item.price}
          <button onClick={() => removeFromCart(item._id)}>Remove</button>
        </div>
      ))}

      <h2>Total: ₹{total}</h2>

      <button onClick={placeOrder}>Place Order 📦</button>
    </div>
  );
}