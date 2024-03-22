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
  const [isOrderLoaded, setIsOrderLoaded] = useState(false);  

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetMyOrdersNotValidQuery();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && order == undefined) {
      setIsOrderLoaded(true);
    }
  }, [isLoading, order]);

  useEffect(() => {
    if (isOrderLoaded && !order) {
      navigate('/shipping');
      toast.error('Vui lòng điền thông tin để đặt hàng')
    }
  }, [isOrderLoaded, order, navigate]);

  const [updatePaymentMethod, { isLoading: loadingUpdate }] = useUpdatePaymentMethodMutation();


  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      console.log("paymentMethod: ", paymentMethod);
      const res = await updatePaymentMethod({orderId: order._id, paymentMethod: paymentMethod}).unwrap();
      while (loadingUpdate)
      {
      }
      console.log(loadingUpdate);
      navigate('/placeorder');}
    catch (err) {
      console.log(err);
      toast.error(err);
    }
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Phương thức thanh toán</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>Lựa chọn phương thức thanh toán</Form.Label>
          <Col>
          <Form.Check
            className='my-2'
            type='radio'
            label='Thanh toán khi nhận hàng'
            id='cash'
            name='paymentMethod'
            value='Thanh toán khi nhận hàng'
            checked={paymentMethod == 'Thanh toán khi nhận hàng'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          ></Form.Check>
          <Form.Check
            className='my-2'
            type='radio'
            label='QR Code'
            id='QR'
            name='paymentMethod'
            value='QR'
            checked={paymentMethod == 'QR'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          ></Form.Check>
            
          </Col>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Tiếp tục
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
