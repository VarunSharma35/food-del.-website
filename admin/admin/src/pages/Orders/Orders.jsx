import React, { useEffect, useState } from 'react'
import './Orders.css'
import axios from "axios"
import { toast } from "react-toastify"
import { assets } from "../../assets/admin_assets/assets"

const Order = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {  // ✅ Fix: "sucess" → "success"
        setOrders(response.data.data);
        console.log(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
      toast.error("Failed to fetch orders");
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: event.target.value
      });

      if (response.data.success) {  // ✅ Fix: "sucess" → "success"
        await fetchAllOrders();
      } else {
        toast.error("Error updating order status");
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order, index) => (  // ✅ Fix: Added `return`
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="Order Parcel" />
              <div>
                <p className='order-item-food'>
                  {order.items.map((item, i) => (
                    <span key={i}>
                      {item.name} x {item.quantity}{i !== order.items.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
                <p className="order-item-name">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <div className="order-item-address">
                  <p>{order.address.street},</p>
                  <p>
                    {order.address.city}, {order.address.state}, {order.address.country}, {order.address.pincode}
                  </p>
                </div>
                <p className='order-item-phone'>{order.address.phone}</p>
              </div>
              <p>Items: {order.items.length}</p>
              <p>₹{order.amount}</p>
              <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Order;
