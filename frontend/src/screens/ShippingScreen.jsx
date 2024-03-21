import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { useGetCartsQuery } from '../slices/cartsApiSlice';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';


const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setPostalCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [ward, setCountry] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [createOrder] = useCreateOrderMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await createOrder({
        shippingAddress: {
          phoneNumber: phoneNumber,
          detailAddress: address,
          city: city,
          district: district,
          ward: ward
        },
      }).unwrap();
      navigate('/payment');
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Giao hàng</h1>
      <Form onSubmit={submitHandler}>
      <Form.Group className='my-2' controlId='Phone number'>
          <Form.Label>Số điện thoại</Form.Label>
          <Form.Control
            type='text'
            placeholder='Nhập số điện thoại'
            value={phoneNumber}
            required
            onChange={(e) => setPhoneNumber(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='Detail address'>
          <Form.Label>Địa chỉ chi tiết (Thôn, xóm, số nhà,...)</Form.Label>
          <Form.Control
            type='text'
            placeholder='VD: 123 Lê Văn Hiến'
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='Ward'>
          <Form.Label>Xã/Phường/Thị Trấn</Form.Label>
          <Form.Control
            type='text'
            placeholder='VD: phường Hòa Hải'
            value={ward}
            required
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='District'>
          <Form.Label>Quận/Huyện</Form.Label>
          <Form.Control
            type='text'
            placeholder='VD: quận Ngũ Hành Sơn'
            value={district}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>


        
        <Form.Group className='my-2' controlId='city'>
          <Form.Label>Tỉnh/Thành phố</Form.Label>
          <Form.Control
            type='text'
            placeholder='VD: thành phố Đà Nẵng'
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Tiếp tục
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
