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
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
      <Form.Group className='my-2' controlId='Phone number'>
          <Form.Label>Phone number</Form.Label>
          <Form.Control
            type='text'
            placeholder='Phone number'
            value={phoneNumber}
            required
            onChange={(e) => setPhoneNumber(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='Detail address'>
          <Form.Label>Detail address</Form.Label>
          <Form.Control
            type='text'
            placeholder='Detail address'
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='District'>
          <Form.Label>District</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter District'
            value={district}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='Ward'>
          <Form.Label>Ward</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Ward'
            value={ward}
            required
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>

        
        <Form.Group className='my-2' controlId='city'>
          <Form.Label>City</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter city'
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
