import { useEffect, useState } from "react";
import API from "../services/api";

export default function Payment() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    const res = await API.get("/payments");
    setPayments(res.data);
  };

  return (
    <div>
      <h1>💳 Payment Status</h1>

      {payments.map((p) => (
        <div key={p._id}>
          <p>Order: {p.orderId}</p>
          <p>Status: {p.status}</p>
        </div>
      ))}
    </div>
  );
}