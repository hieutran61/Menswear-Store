import asyncHandler from '../middleware/asyncHandler.js';
import Cart from '../models/cart.js';
import Order from '../models/order.js';
import Product from '../models/product.js';
import readMail from '../utils/readMail.js';
import { calcPrices } from '../utils/calcPrices.js';
import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // NOTE: here we must assume that the prices from our client are incorrect.
    // We must only trust the price of the item as it exists in
    // our DB. This prevents a user paying whatever they want by hacking our client
    // side code - https://gist.github.com/bushblade/725780e6043eaf59415fbaf6ca7376ff

    // get the ordered items from our database
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    // map over the order items and use the price from our items from database
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    // calculate prices
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id, isValid: true });
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  ).populate({
    path: 'orderItems.product',
    model: 'Product',
  });

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  console.log("inside updateOrderToPaid()");

  const order = await Order.findById(req.params.id);

  if (order) {
    order.paymentResult = "Paid";
    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  console.log("inside createOrder() in orderController");
  const cart = await Cart.findOne({ user: req.user._id });

  // calculate prices
  const { cartTotal, taxPrice, shippingPrice, totalPrice } =
    calcPrices(cart.cartItems);

  var order = await Order.findOne({ user: req.user._id, isValid: false });

  if (order) {
    order.orderItems= cart.cartItems,
    order.shippingAddress= req.body.shippingAddress,
    order.taxPrice= taxPrice,
    order.shippingPrice= shippingPrice,
    order.totalPrice= totalPrice
  } else {
    order = new Order({
      user: cart.user,
      orderItems: cart.cartItems,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: "",
      paymentResult: "",
      taxPrice: taxPrice,
      shippingPrice: shippingPrice,
      totalPrice: totalPrice,
      isPaid: false,
      paidAt: null,
      isDelivered: false,
      deliveredAt: null,
      isValid: false
    });
  }


  

  const createdOrder = await order.save();

  res.status(201).json(createdOrder);
  
});

// @desc    Update payment method of order
// @route   PUT /api/orders
// @access  Private
const updatePaymentMethod = asyncHandler(async (req, res) => {
  console.log("inside updatePaymentMethod() in orderController");
  const { orderId, paymentMethod } = req.body;
  const order = await Order.findById(req.body.orderId);

  if (order) {
    order.paymentMethod = paymentMethod;
    order.paymentResult = "Not paid";
    order.isPaid = false;

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrderNotValid = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id, isValid: false }).populate({
    path: 'orderItems.product',
    model: 'Product',
  });
  res.json(orders[0]);
});

// @desc    Place order
// @route   GET /api/orders/:id
// @access  Private
const placeOrder = asyncHandler(async (req, res) => {
  console.log("inside placeOrder() in orderController");
  console.log("req body", req.body);

  const cart = await Cart.findOne({ user: req.user._id });
  const order = await Order.findById(req.params.id);
  if (order) {
    // Lặp qua các sản phẩm trong đơn hàng để giảm số lượng sản phẩm từng kích cỡ
    for (const orderItem of order.orderItems) {
      const product = await Product.findById(orderItem.product);
      if (product) {
        // Duyệt qua từng kích cỡ của sản phẩm và giảm số lượng tương ứng
        for (const size of product.size) {
          if (size.sizeName === orderItem.size2) {
            size.countInStock -= orderItem.quantity;
            break; // Kết thúc vòng lặp sau khi giảm số lượng
          }
        }
        // Lưu lại thông tin sản phẩm đã được cập nhật
        await product.save();
      }
    }

    if (req.body.paymentMethod == "QR") {
      order.paymentResult = "Paid";
      order.isPaid = true;
      order.paidAt = new Date().getTime();
    }

    order.isValid = true;
    cart.cartItems = [];
    await cart.save();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});


// @desc    Place order
// @route   GET /api/orders/:id
// @access  Private
const getMail = asyncHandler(async (req, res) => {
  console.log("inside getMail");
  const totalPrice = req.body.totalPrice;
  const startTime = Date.now(); // Track start time for timeout

  try {
    let amount;
    let timeoutId;

    const checkEmail = async () => {
      console.log("read mail");
      amount = await readMail();

      if (amount === 2000) {
        clearTimeout(timeoutId);
        res.json({ status: true });
      } else if (Date.now() - startTime >= 60000) { // Check for timeout
        clearTimeout(timeoutId);
        res.json({ status: false });
      } else {
        // Schedule next call after 3 seconds
        timeoutId = setTimeout(checkEmail, 3000);
      }
    };

    // Initial call
    await checkEmail();

  } catch (error) {
    console.error('Error reading email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

  

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,

  getOrders,
  createOrder,
  updatePaymentMethod,
  getMyOrderNotValid,
  placeOrder,
  getMail
};
