import React from 'react';
import { InputNumber, Alert } from 'rsuite';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import UserContext from './UserContext.js';

// eslint-disable-next-line react/prefer-stateless-function
class CartRow extends React.Component {
  render() {
    const { dish } = this.props;
    console.log('Current dish state is -----');
    console.log(dish);

    const user = this.context;
    const { cartItems } = user;
    const selectAmount = cartItems[dish.dishId.toString()];

    if (dish.stock === 0) {
      const copiedCartItems = JSON.parse(JSON.stringify(cartItems));
      delete copiedCartItems[dish.dishId.toString()];
      user.updateCartItems(copiedCartItems);
      Alert.warning(`${dish.name} is out of stock. It has been deleted from your cart!`, 4000);
    } else if (selectAmount > dish.stock) {
      const copiedCartItems = JSON.parse(JSON.stringify(cartItems));
      copiedCartItems[dish.dishId.toString()] = dish.stock;
      console.log('testing the stock under slected amount]]]]]]');
      console.log(copiedCartItems);
      user.updateCartItems(copiedCartItems);
      Alert.warning(`Stock of ${dish.name} is low. The amount in your cart has been adjusted.`, 4000);
    }

    const dishTotal = selectAmount * dish.price;

    // function handleInputAmountChange(e) {
    //   const { target } = e;
    //   const { value } = target;
    //   const valueInt = parseInt(value, 10);
    //   if (valueInt !== selectAmount) {
    //     const copiedCartItems = JSON.parse(JSON.stringify(cartItems));
    //     copiedCartItems[dish.dishId] = valueInt;
    //     user.updateCartItems(copiedCartItems);
    //   }
    // }
    function handleInputAmountChange(value) {
      const valueInt = parseInt(value, 10);
      if (valueInt !== selectAmount) {
        const copiedCartItems = JSON.parse(JSON.stringify(cartItems));
        copiedCartItems[dish.dishId.toString()] = valueInt;
        user.updateCartItems(copiedCartItems);
      }
    }

    function handleRemove(e) {
      e.preventDefault();
      const copiedCartItems = JSON.parse(JSON.stringify(cartItems));
      delete copiedCartItems[dish.dishId.toString()];
      user.updateCartItems(copiedCartItems);
      Alert.warning(`${dish.name} has been removed from your cart!`, 4000);
    }

    return (
      <tr>
        <td>
          <LinkContainer to={`/order/${dish.dishId}`}>
            <Button variant="link">
              {dish.name}
            </Button>
          </LinkContainer>
        </td>
        <td>{`$${dish.price}`}</td>
        <td>{`$${dishTotal}`}</td>
        <td>
          <InputNumber
            value={selectAmount}
            min={1}
            max={dish.stock}
            onChange={handleInputAmountChange}
            step={1}
          />
        </td>
        <td>
          <Button
            size="md"
            variant="link"
            onClick={handleRemove}
          >
            Remove
          </Button>
        </td>
      </tr>
    );
  }
}

CartRow.contextType = UserContext;
export default CartRow;
