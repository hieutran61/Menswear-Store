import React, { useEffect, useState } from 'react';
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
  const [orderLoaded, setOrderLoaded] = useState(false);

  useEffect(() => {
    if (isLoading === false && order == undefined) {
      setOrderLoaded(true);
    }
    if (order && (order.paymentMethod === "" || order.paymentMethod)) {
      // Force a re-render
      refetch();
    }
  }, [isLoading, order, refetch]);

  useEffect(() => {
    if (orderLoaded && !order) {
      navigate(`/shipping`);
      toast.error('Vui lòng điền thông tin để đặt hàng')
    }
  }, [orderLoaded, order, navigate]);

  
  const placeOrderHandler = async () => {
    try {
      if (order.paymentMethod === "Thanh toán khi nhận hàng") {
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
      {(order==undefined || isLoading) ? (
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
                  <h2>Thông tin giao hàng</h2>
                  <p>
                    <strong>Địa chỉ: </strong>
                    {order.shippingAddress.detailAddress},{' '}{order.shippingAddress.ward}, 
                    {' '}{order.shippingAddress.district},{' '}
                    {order.shippingAddress.city}
                  </p> 
                  <p>
                    <strong>Số điện thoại: </strong>
                    0{order.shippingAddress.phoneNumber}
                  </p>
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>Phương thức thanh toán</h2>
                  <strong>Phương thức: </strong>
                  {order.paymentMethod}
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>Thông tin sản phẩm </h2>
                  {order.orderItems.length === 0 ? (
                    <Message>Đơn hàng của bạn trống</Message>
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
                    <h2>Tóm tắt đơn hàng</h2>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tiền hàng</Col>
                      <Col>{order.orderItems.reduce((acc, item) => acc + (item.itemPrice * 100) / 100, 0)} VND</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Phí vận chuyển</Col>
                      <Col>{order.shippingPrice} VND</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Thuế</Col>
                      <Col>{order.taxPrice} VND</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Thành tiền</Col>
                      <Col>{order.totalPrice} VND</Col>
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
                      Đặt hàng
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
