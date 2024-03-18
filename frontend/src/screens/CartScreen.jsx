import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import { useGetCartsQuery, useDeleteCartItemMutation } from '../slices/cartsApiSlice';
import { toast } from 'react-toastify';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const cart = useSelector((state) => state.cart);
  // const { cartItems } = cart;

  const {
    data: cartItems,
    isLoading,
    error,
    refetch,
  } = useGetCartsQuery();
  console.log("isLoading: ", isLoading);
  console.log("cartItems: ", cartItems);

  const [deleteItem] = useDeleteCartItemMutation();

  // NOTE: no need for an async function here as we are not awaiting the
  // resolution of a Promise
  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const deleteItemHandler = async (id) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteItem(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  // if (isLoading) {
  //   return <p>Loading...</p>;
  // }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Row>
          <Col md={8}>
            <h1 style={{ marginBottom: '20px' }}>Shopping Cart</h1>
            {cartItems.length === 0 ? (
              <Message>
                Your cart is empty <Link to='/'>Go Back</Link>
              </Message>
            ) : (
              <ListGroup variant='flush'>
                {cartItems.map((item) => (
                  <ListGroup.Item key={item.product._id}>
                    <Row>
                      <Col md={2}>
                        <Image src={item.product.image} alt={item.product.name} fluid rounded />
                      </Col>
                      <Col md={3}>
                        <Link to={`/product/${item.product._id}`}>{item.product.name}</Link>
                      </Col>
                      <Col md={2}>${item.product.price} VND</Col>
                      <Col md={2}>Size: {item.product.size}</Col>
                      <Col md={2}>
                        <Form.Control
                          as='select'
                          value={item.quantity}
                          onChange={(e) =>
                            addToCartHandler(item, Number(e.target.value))
                          }
                        >
                          {[...Array(item.product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                      <Col md={1}>
                        <Button
                          type='button'
                          variant='light'
                          onClick={() => deleteItemHandler(item.product._id)}
                        >
                          <FaTrash />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Col>
          <Col md={4}>
            <Card>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h2>
                    Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
                    items
                  </h2>
                  $
                  {cartItems
                    .reduce((acc, item) => acc + item.quantity * item.product.price, 0)
                    .toFixed(2)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    type='button'
                    className='btn-block'
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Proceed To Checkout
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default CartScreen;