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
  
  
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  

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
              label='PayPal or Credit Card'
              id='PayPal'
              name='paymentMethod'
              value='PayPal'
              checked
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
