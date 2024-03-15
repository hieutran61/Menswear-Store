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
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [district, setPostalCode] = useState( shippingAddress.district || '');
  const [phoneNumber, setPhoneNumber] = useState( shippingAddress. phoneNumber || '');
  const [ward, setCountry] = useState(shippingAddress.ward || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  const { data: cartItems } = useGetCartsQuery();

  const submitHandler = async (e) => {
    e.preventDefault();

    console.log("phone number: ", phoneNumber);
    console.log("detail address: ", address);
    console.log("City: ", city);
    console.log("District: ", district);

    console.log("Ward: ", ward);
    
    
    // try {
    //   const res = await createOrder({
    //     orderItems: cartItems,
    //     shippingAddress: cart.shippingAddress,
    //     paymentMethod: cart.paymentMethod,
    //     itemsPrice: cart.itemsPrice,
    //     shippingPrice: cart.shippingPrice,
    //     taxPrice: cart.taxPrice,
    //     totalPrice: cart.totalPrice,
    //   }).unwrap();
    //   navigate('/payment');
    // } catch (err) {
    //   toast.error(err);
    // }
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
