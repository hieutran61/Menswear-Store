import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/order.js';
import Cart from '../models/cart.js';
import Product from '../models/product.js';
import { calcPrices } from '../utils/calcPrices.js';
import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal.js';

// @desc    Create new cart
// @route   POST /api/carts
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
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

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
  // NOTE: here we need to verify the payment was made to PayPal before marking
  // the order as paid
  const { verified, value } = await verifyPayPalPayment(req.body.id);
  if (!verified) throw new Error('Payment not verified');

  // check if this transaction has been used before
  const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
  if (!isNewTransaction) throw new Error('Transaction has been used before');

  const order = await Order.findById(req.params.id);

  if (order) {
    // check the correct amount was paid
    const paidCorrectAmount = order.totalPrice.toString() === value;
    if (!paidCorrectAmount) throw new Error('Incorrect amount paid');

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

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

// @desc    Add items to cart
// @route   POST /api/carts
// @access  Private
const addItemToCart = asyncHandler(async (req, res, next) => {
  console.log('into addItemToCart() in cartController');
  const { product, quantity, size, itemPrice } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // Nếu giỏ hàng không tồn tại, bạn có thể tạo mới giỏ hàng ở đây
      // Hoặc thực hiện các xử lý phù hợp với logic ứng dụng của bạn
      cart = new cart({ user: rep.user._id, cartItems: [] });
    }

    const productDetails = await Product.findById(product);
    if (!productDetails) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Kiểm tra xem sản phẩm có tồn tại trong kho với size cụ thể không
    const selectedSize = productDetails.size.find(s => s.sizeName === size);
    if (!selectedSize || selectedSize.countInStock <= 0) {
      console.log('Selected size is not available');
      return res.status(400).json({ message: 'Selected size is not available' });
    }

    let existItem = cart.cartItems.find(
      (x) => x && x.product && x.product.toString() === product && x.size2 === size
    );

    if (existItem) {
      // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật `quantity` của sản phẩm
      existItem.quantity = quantity;
      existItem.itemPrice = itemPrice;
    } else {
      // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm mới sản phẩm vào giỏ hàng
      existItem = { product, quantity, itemPrice, size2: size };
      cart.cartItems.push(existItem);
    }

    const updatedCart = await cart.save();
    console.log("cart after add: ", updatedCart);
    res.json(updatedCart);
  } catch (error) {
    console.log(error);
  }
});

// @desc    Get all items in cart
// @route   GET /api/cart
// @access  Private
const getAllItemsInCart = asyncHandler(async (req, res) => {
  console.log("inside getAllItemsInCart()");
  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'cartItems.product',
    model: 'Product',
  });
  if (cart === null) {
    // Nếu cart là null, thực hiện các xử lý phù hợp ở đây
    // Ví dụ: trả về một phản hồi lỗi hoặc thực hiện hành động khác
    res.status(404).json({ message: 'Cart not found' });
    return;
  }

  console.log("cart before filter: ", cart);
  // Lọc ra các cartItem có product có size bằng size2 và countInStock > 0
  const filteredCartItems = cart.cartItems.filter(item => {
    return (
      item.product.size.some(size => size.sizeName === item.size2 && size.countInStock > 0) // Kiểm tra countInStock
    );
  });
  console.log("Cart after filter: ", filteredCartItems);

  const updatedCartItems = await Promise.all(filteredCartItems.map(async (item) => {
    const product = await Product.findById(item.product); // Fetch product details
    const availableSize = product.size.find((size) => size.sizeName === item.size2);

    if (availableSize && (item.quantity > availableSize.countInStock)) {
      item.quantity = availableSize.countInStock; // Adjust quantity
      item.itemPrice = (item.quantity * product.price *100) / 100;
    }

    return item;
  }));
  console.log("updatedCartItems: ", updatedCartItems);

  cart.cartItems = updatedCartItems;
  await cart.save();


  // Chuyển đổi thành định dạng mà bạn muốn trả về
  const formattedCartItems = filteredCartItems.map(item => {
    const { _id: cartItemId, product, quantity, itemPrice, size2 } = item;
    const { _id, name, image, price, size } = product;
    return {
      _id: cartItemId,
      product: { _id, name, image, price, size },
      quantity,
      itemPrice,
      size2
    };
  });

  res.json(formattedCartItems);
});

// @desc    Remove item from cart
// @route   DELETE /api/carts/:id
// @access  Private
const deleteItem = asyncHandler(async (req, res) => {
  const itemId = req.params.id;

  const userId = req.user._id;

  console.log("cartItem Id: ", itemId);

  // Find the cart of the user
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  // Lọc ra cartItem cần xóa bằng cách so sánh id
  const updatedCartItems = cart.cartItems.filter(item => item._id.toString() !== itemId);

  // Cập nhật giỏ hàng với các cartItem đã lọc
  cart.cartItems = updatedCartItems;

  // Lưu lại giỏ hàng đã cập nhật
  const updatedCart = await cart.save();

  if (!updatedCart) {
    res.status(404);
    throw new Error('Cart not updated');
  }

  res.json({ message: 'Item removed' });
});


export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  addItemToCart,
  getAllItemsInCart,
  deleteItem,
};
