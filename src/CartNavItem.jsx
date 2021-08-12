import React from 'react';
import {
  Nav, Tooltip, OverlayTrigger,
} from 'react-bootstrap';
import { Badge } from 'rsuite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { LinkContainer } from 'react-router-bootstrap';
import UserContext from './UserContext.js';

// eslint-disable-next-line react/prefer-stateless-function
class CartNavItem extends React.Component {
  render() {
    const user = this.context;
    const { cartItems } = user;

    if (Object.keys(cartItems).length === 0) {
      return (
        <LinkContainer exact to="/cart">
          <Nav.Item>
            <OverlayTrigger
              placement="left"
              delayShow={800}
              overlay={<Tooltip id="goto-cart">Go To My Cart</Tooltip>}
            >
              <FontAwesomeIcon icon={faShoppingCart} size="1x" color="white" />
            </OverlayTrigger>
          </Nav.Item>
        </LinkContainer>
      );
    }
    return (
      <LinkContainer exact to="/cart">
        <Nav.Item>
          <OverlayTrigger
            placement="left"
            delayShow={800}
            overlay={<Tooltip id="goto-cart">Go To My Cart</Tooltip>}
          >
            <Badge>
              <FontAwesomeIcon icon={faShoppingCart} size="1x" color="white" />
            </Badge>
          </OverlayTrigger>
        </Nav.Item>
      </LinkContainer>
    );
  }
}

CartNavItem.contextType = UserContext;
export default CartNavItem;
