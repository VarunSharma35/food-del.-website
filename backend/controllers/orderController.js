import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

// Initialize Stripe with secret key
const stripe = new Stripe("your-stripe-secret-key");

const placeOrder = async (req, res) => {
    const frontend_url = "https://food-del-frontend-q1dk.onrender.com";

    try {
        // Extract payment method
        const { userId, items, amount, address, paymentMethod } = req.body;

        // Create a new order
        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address,
            payment: paymentMethod === "cod" ? false : true, // COD orders are unpaid initially
            paymentMethod
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // If Cash on Delivery, return success response immediately
        if (paymentMethod === "cod") {
            return res.json({ success: true, message: "Order placed successfully (Cash on Delivery)" });
        }

        // Create Stripe payment session for online payments
        const line_items = items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: { name: item.name },
                unit_amount: item.price * 100, 
            },
            quantity: item.quantity,
        }));

        // Add delivery charges
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: { name: "Delivery Charges" },
                unit_amount: 40 * 100,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log("Error placing order:", error);
        res.status(500).json({ success: false, message: "Error processing order" });
    }
};

// Verify Payment and Update Order
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Payment successful" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment failed, order deleted" });
        }
    } catch (error) {
        console.log("Error verifying order:", error);
        res.status(500).json({ success: false, message: "Error verifying order" });
    }
};

// Fetch user orders
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log("Error fetching user orders:", error);
        res.status(500).json({ success: false, message: "Error fetching orders" });
    }
};

// List orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log("Error fetching order list:", error);
        res.status(500).json({ success: false, message: "Error fetching order list" });
    }
};

// Update order status (Admin)
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Order status updated" });
    } catch (error) {
        console.log("Error updating order status:", error);
        res.status(500).json({ success: false, message: "Error updating status" });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
