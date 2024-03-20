import { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';
import { useUpdatePaymentMethodMutation, useGetMyOrdersNotValidQuery } from '../slices/ordersApiSlice';


const PaymentScreen = () => {
  
  
  const [paymentMethod, setPaymentMethod] = useState('Thanh toán khi nhận hàng');
  

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetMyOrdersNotValidQuery();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isLoading && order==null)
  navigate('/shipping');

  console.log("Order: ", order);
  const [updatePaymentMethod] = useUpdatePaymentMethodMutation();


  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await updatePaymentMethod({orderId: order._id, paymentMethod: paymentMethod}).unwrap();
      navigate('/placeorder');}
    catch (err) {
      console.log(err);
      toast.error(err);
    }
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col>
          <Form.Check
            className='my-2'
            type='radio'
            label='Thanh toán khi nhận hàng'
            id='cash'
            name='paymentMethod'
            value='Thanh toán khi nhận hàng'
            checked={paymentMethod === 'Thanh toán khi nhận hàng'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          ></Form.Check>
          <Form.Check
            className='my-2'
            type='radio'
            label='QR Code'
            id='QR'
            name='paymentMethod'
            value='QR'
            checked={paymentMethod === 'QR'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          ></Form.Check>
            
          </Col>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
