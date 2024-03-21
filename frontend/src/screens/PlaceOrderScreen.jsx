import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { usePlaceOrderMutation, useGetMyOrdersNotValidQuery } from '../slices/ordersApiSlice';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetMyOrdersNotValidQuery();
  const [placeOrder, { isLoading: loadingUpdate }] = usePlaceOrderMutation();


  useEffect(() => {
    if ( order.paymentMethod=="" || order.paymentMethod) {
      // Force a re-render
      refetch();
    }
  }, [order.paymentMethod, refetch]);

  
  const placeOrderHandler = async () => {
    try {
      if (order.paymentMethod == "Thanh toán khi nhận hàng") {
        const res = await placeOrder({orderId: order._id});
        navigate(`/order/${res.data._id}`);
      }
      else if (order.paymentMethod == "QR"){
        navigate(`/qr`);
      }
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <CheckoutSteps step1 step2 step3 step4 />
          <Row>
            <Col md={8}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h2>Shipping</h2>
                  <p>
                    <strong>Address:</strong>
                    {order.shippingAddress.detailAddress}, {order.shippingAddress.ward}{' '}
                    {order.shippingAddress.district},{' '}
                    {order.shippingAddress.city}
                  </p> 
                  <p>
                    <strong>Phone number:</strong>
                    0{order.shippingAddress.phoneNumber}
                  </p>
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>Payment Method</h2>
                  <strong>Method: </strong>
                  {order.paymentMethod}
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>Order Items</h2>
                  {order.orderItems.length === 0 ? (
                    <Message>Your order is empty</Message>
                  ) : (
                    <ListGroup variant='flush'>
                      {order.orderItems.map((item, index) => (
                        <ListGroup.Item key={index}>
                          <Row>
                            <Col md={1}>
                              <Image
                                src={item.product.image}
                                alt={item.product.name}
                                fluid
                                rounded
                              />
                            </Col>
                            <Col>
                              <Link to={`/product/${item.product._id}`}>
                                {item.product.name}
                              </Link>
                            </Col>
                            <Col md={4}>
                              {item.quantity} x {item.product.price} = { item.itemPrice}
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <h2>Order Summary</h2>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Items</Col>
                      <Col>${order.orderItems.reduce((acc, item) => acc + (item.itemPrice * 100) / 100, 0)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>${order.shippingPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tax</Col>
                      <Col>${order.taxPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Total</Col>
                      <Col>${order.totalPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {error && (
                      <Message variant='danger'>{error.data.message}</Message>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn-block'
                      disabled={order.cartItems === 0}
                      onClick={placeOrderHandler}
                    >
                      Place Order
                    </Button>
                    {isLoading && <Loader />}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default PlaceOrderScreen;
