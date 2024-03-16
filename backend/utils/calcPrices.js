function addDecimals(num) {
  return (Math.round(num * 100) / 100).toFixed(2);
}

// NOTE: the code below has been changed from the course code to fix an issue
// with type coercion of strings to numbers.
// Our addDecimals function expects a number and returns a string, so it is not
// correct to call it passing a string as the argument.

export function calcPrices(orderItems) {
  // Calculate the items price in whole number (pennies) to avoid issues with
  // floating point number calculations
  const cartTotal = orderItems.reduce(
    (acc, item) => acc + (item.itemPrice * 100) / 100,
    0
  );

  // Calculate the shipping price
  const shippingPrice = (30000*100)/100;

  // Calculate the tax price
  const taxPrice = (0.05 * cartTotal * 100) / 100;

  // Calculate the total price
  const totalPrice = cartTotal + shippingPrice + taxPrice;

  // return prices as strings fixed to 2 decimal places
  return {
    cartTotal: addDecimals(cartTotal),
    shippingPrice: addDecimals(shippingPrice),
    taxPrice: addDecimals(taxPrice),
    totalPrice: addDecimals(totalPrice),
  };
}
