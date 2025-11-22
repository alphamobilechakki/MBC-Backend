import Order from '../../models/orderModel.js';
import cashfree from '../../config/cashfree.js';
import User from '../../models/userModel.js';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    const userId = req.user._id;

    const order = new Order({
      user: userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const savedOrder = await order.save();

    const user = await User.findById(userId);

    const request = {
      order_amount: savedOrder.totalPrice,
      order_currency: 'INR',
      order_note: 'Test order',
      customer_details: {
        customer_id: user._id.toString(),
        customer_name: user.name,
        customer_email: user.email,
        customer_phone: user.mobile,
      },
      order_meta: {
        return_url: `http://localhost:8080/order/{order_id}`,
      },
    };

    const response = await cashfree.orders.create(request);
    savedOrder.cashfree_order_id = response.data.order_id;
    await savedOrder.save();

    res.status(201).json({
      success: true,
      data: savedOrder,
      cashfreeOrder: response.data,
      message: 'Order created successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all orders for a user.......................................................................................................................................................................................................
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('user', 'name');

    res.status(200).json({
      success: true,
      data: orders,
      message: 'Orders retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a single order by ID..................... ......................................................................................................................................................................................................
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name mobile');

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: order,
      message: 'Order retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};