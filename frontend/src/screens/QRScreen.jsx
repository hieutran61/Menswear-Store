import { useState } from 'react';
import React, { useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useGetMyOrdersNotValidQuery, useGetMailMutation, usePlaceOrderMutation } from '../slices/ordersApiSlice';


const QRScreen = () => {

  const navigate = useNavigate();
  const [amountFromEmail, setAmountFromEmail] = useState(null);
  const [getMail, { isLoading: loadingUpdate }] = useGetMailMutation();
  const [placeOrder, { isLoading: loadingPlaceOrder }] = usePlaceOrderMutation();



  const {
    data: order,
    refetch,
    isLoading: orderLoading,
    error: orderError,
  } = useGetMyOrdersNotValidQuery();

  useEffect(() => {
    const fetchEmailData = async () => {
      console.log("in fetchEmailData");
      try {
        const response = await getMail({ totalPrice: order?.totalPrice });
        console.log(response);
        if (response.data.status) {
          const res = await placeOrder({ orderId: order._id, paymentMethod: "QR" });
          navigate(`/order/${res.data._id}`);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message || 'Error fetching email data');
      }
    };

    if (order && order.totalPrice) {
      fetchEmailData();
    }
  }, [getMail, order, navigate]);






  return (
    <>
      {orderLoading ? (
        <Loader />
      ) : orderError ? (
        <Message variant='danger'>
          {orderError?.data?.message || orderError.error}
        </Message>
      ) : (
        <div>
          <h1>QR Code Screen</h1>
          {/* Hiển thị hình ảnh mã QR */}
          <div style={{ textAlign: 'center' }}>
            <img src={`https://img.vietqr.io/image/TIMO-9007041152328-compact2.png?amount=${order?.totalPrice}`} alt="QR Code" />
          </div>        
        </div>
      )}
    </>
  );

};

export default QRScreen;
