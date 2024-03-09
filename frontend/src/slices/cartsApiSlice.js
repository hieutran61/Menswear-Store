import { apiSlice } from './apiSlice';
import { CARTS_URL, PAYPAL_URL } from '../constants';

export const cartApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addItemToCart: builder.mutation({
            query: (item) => ({
                url: CARTS_URL,
                method: 'POST',
                body: item,
            }),
        }),
        getCarts: builder.query({
            query: () => ({
                url: CARTS_URL,
                method: 'GET',
            }),
            keepUnusedDataFor: 1,
        }),

    }),
});

export const {
    useAddItemToCartMutation,
    useGetCartsQuery,

} = cartApiSlice;
