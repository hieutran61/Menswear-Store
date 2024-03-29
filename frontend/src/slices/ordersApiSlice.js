import { apiSlice } from './apiSlice';
import { ORDERS_URL, PAYPAL_URL } from '../constants';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: order,
      }),
    }),
    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: 'PUT',
      }),
    }),
    getPaypalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getMail: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}/qr`,
        method: 'POST',
        body: data,
      }),
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: 'PUT',
      }),
    }),
    updatePaymentMethod: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}/payment`,
        method: 'POST',
        body: data,
      }),
    }),
    getMyOrdersNotValid: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/payment`,
      }),
      keepUnusedDataFor: 5,
    }),
    placeOrder: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}/${data.orderId}`,
        method: 'PUT',
        body: data
      }),
    }),
    
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
  useUpdatePaymentMethodMutation,
  useGetMyOrdersNotValidQuery,
  usePlaceOrderMutation,
  useGetMailMutation
} = orderApiSlice;
