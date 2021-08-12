import React from 'react';

const UserContext = React.createContext({
  signedIn: false,
  cartItems: {},
  updateCartItems: () => {},
});

export default UserContext;
