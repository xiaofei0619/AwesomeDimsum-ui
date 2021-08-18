/* eslint-disable prefer-template */
import React from 'react';
import {
  Button, Form, Col, Row,
} from 'react-bootstrap';
import {
  PanelGroup, Panel,
} from 'rsuite';
import { LinkContainer } from 'react-router-bootstrap';
import { withRouter } from 'react-router-dom';
import graphQLFetch from './graphQLFetch.js';
import store from './store.js';
import UserContext from './UserContext.js';

const shortid = require('shortid');

class PlaceOrderPlain extends React.Component {
  static async fetchStock() {
    console.log('fetchStock called');
    const data = await graphQLFetch(`query {
      stockList {
        dishId stock
      }
    }`);
    return data;
  }

  static async updateStock(dishId, newStock) {
    console.log('updateStock called');
    const query = `mutation stockUpdate(
      $dishId: Int!,
      $stock: Int!
    ){
      stockUpdate (
        dishId: $dishId,
        stock: $stock
      ) {
        dishId stock
      }
    }`;
    const data = await graphQLFetch(query, { dishId, stock: newStock });
    return data;
  }

  static async placeOrder(newOrder) {
    console.log('placeOrder called');
    const query = `mutation orderAdd(
      $order: OrderInputs!
    ){
      orderAdd (
        order: $order
      ) {
        id orderId status name phone created pickup
        subtotal subtotalDiscount tax total items request
      }
    }`;
    const data = await graphQLFetch(query, { order: newOrder });
    return data;
  }

  constructor(props) {
    super(props);
    this.webOpenTime = new Date();
    this.state = {
      name: '',
      phone: '',
      request: '',
      pickup: '',
      touched: {
        name: false,
        phone: false,
        pickup: false,
        request: false,
      },
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleInputChange(event) {
    const { target } = event;
    const { value } = target;
    const { name } = target;
    this.setState({
      [name]: value,
    });
  }

  handleBlur(evt) {
    const { target } = evt;
    const { name } = target;
    this.setState(state => ({
      touched: {
        ...state.touched,
        [name]: true,
      },
    }));
  }

  validate(name, phone, pickup) {
    const errors = {
      name: '',
      phone: '',
      pickup: '',
    };

    // eslint-disable-next-line react/destructuring-assignment
    if (!this.state.touched.name) {
      errors.name = 'Name can not be blank';
    }
    // eslint-disable-next-line react/destructuring-assignment
    if (!this.state.touched.phone) {
      errors.phone = 'Phone can not be blank';
    }
    // eslint-disable-next-line react/destructuring-assignment
    if (!this.state.touched.pickup) {
      errors.pickup = 'PickUp time must be selected';
    }

    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.touched.name && name.length < 3) {
      errors.name = 'Please leave a name with at least 3 characters';
    // eslint-disable-next-line react/destructuring-assignment
    } else if (this.state.touched.name && name.length > 20) {
      errors.name = 'Please leave a name with no longer than 20 characters';
    }

    const phoneno = /^\(\d\d\d\)\s\d\d\d-\d\d\d\d$/;
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.touched.phone && phone.match(phoneno) === null) {
      errors.phone = 'Phone number must in format: (xxx) xxx-xxxx';
    }

    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.touched.pickup && pickup === '') {
      errors.pickup = 'Please pickup a valid time slot';
    }
    return errors;
  }

  render() {
    // If cart is emptied show same page as empty cart
    const user = this.context;
    const { cartItems } = user;
    if (Object.keys(cartItems).length === 0) {
      return (
        <div className="container" style={{ width: '400px', height: '400px', marginTop: '150px' }}>
          <div className="row justify-content-center">
            <h4>Can Not Get Place Order Page Because Your Cart Is Empty. Start Ordering ?</h4>
            <LinkContainer exact to="/menu">
              <Button variant="link">Check Menu</Button>
            </LinkContainer>
          </div>
        </div>
      );
    }

    console.log('Rendering state in reder()...');
    console.log(this.state);

    const {
      name, phone, request, pickup,
    } = this.state;
    const errors = this.validate(name, phone, pickup);

    // get open page date
    const year = this.webOpenTime.getFullYear();
    const month = ('0' + (this.webOpenTime.getMonth() + 1)).slice(-2);
    const day = ('0' + this.webOpenTime.getDate()).slice(-2);
    const webOpenTimestamp = this.webOpenTime.getTime();
    const today = `${year}-${month}-${day}`;

    // generate entire day slots
    const slots = ['11:00:00', '11:15:00', '11:30:00', '11:45:00', '12:00:00', '12:15:00', '12:30:00', '12:45:00',
      '13:00:00', '13:15:00', '13:30:00', '13:45:00', '14:00:00', '14:15:00', '14:30:00', '14:45:00', '15:00:00',
      '15:15:00', '15:30:00', '15:45:00', '16:00:00', '16:15:00', '16:30:00', '16:45:00', '17:00:00', '17:15:00',
      '17:30:00', '17:45:00', '18:00:00', '18:15:00', '18:30:00', '18:45:00', '19:00:00', '19:15:00', '19:30:00',
      '19:45:00', '20:00:00', '20:15:00', '20:30:00', '20:45:00', '21:00:00'];

    const timeSlots = [];
    for (let i = 0; i < slots.length; i += 1) {
      timeSlots[i] = new Date(`${today}T${slots[i]}-07:00`);
    }
    const timeInThirtyMin = webOpenTimestamp + 1000 * 60 * 30;

    let showSlots = [];
    if (timeInThirtyMin < timeSlots[0].getTime()) {
      showSlots = timeSlots;
    } else if (timeInThirtyMin > timeSlots[timeSlots.length - 1].getTime()) {
      showSlots = [];
    } else {
      for (let j = 1; j < timeSlots.length - 1; j += 1) {
        if (timeInThirtyMin > timeSlots[j].getTime() && timeInThirtyMin < timeSlots[j + 1]) {
          showSlots = timeSlots.slice(j + 1);
        }
      }
    }

    const slotOptions = showSlots.map((slot, index) => (
      <option key={index.toString()} value={slot}>
        {`${slot.toLocaleTimeString()} ~ ${new Date(slot.getTime() + 1000 * 60 * 15).toLocaleTimeString()}`}
      </option>
    ));

    // birthday = new Date('1995-12-17T14:24:00-08:00')
    // 1995-12-17T22:24:00.000Z
    // birthday.toLocaleTimeString()
    // '2:24:00 PM'
    const dishes = store.menuData;

    const onSubmitOrder = async (e) => {
      e.preventDefault();
      // fetch stock list
      const stockData = await PlaceOrderPlain.fetchStock();
      if (stockData) {
        console.log(stockData);
        const { stockList } = stockData;
        const mergeList = [];
        for (let i = 0; i < dishes.length; i += 1) {
          mergeList.push({
            ...dishes[i],
            ...(stockList.find(item => item.dishId === dishes[i].dishId)),
          });
        }
        // cartDishes is an array of dishes info including stock for the selected items in the cart
        const cartDishes = mergeList.filter(
          dish => Object.keys(cartItems).indexOf(dish.dishId.toString()) !== -1,
        );

        // Do the calculation
        let subtotal = 0.0;
        let subtotalDiscount = 0.0;
        for (let j = 0; j < cartDishes.length; j += 1) {
          const amount = cartItems[cartDishes[j].dishId.toString()];
          const unitPrice = cartDishes[j].price;
          subtotal += amount * unitPrice;
        }
        if (subtotal >= 60.0) {
          subtotalDiscount = subtotal * 0.85;
        } else {
          subtotalDiscount = subtotal;
        }
        const tax = subtotalDiscount * 0.1;
        const total = subtotalDiscount + tax;

        // loop through dish items to update stock
        let successUpdateStock = Boolean(true);
        for (let k = 0; k < cartDishes.length; k += 1) {
          const cartDishId = cartDishes[k].dishId;
          const originStock = cartDishes[k].stock;
          const cartAmount = cartItems[cartDishId.toString()];
          const newStock = originStock - cartAmount;

          // eslint-disable-next-line no-await-in-loop
          const updateStockData = await PlaceOrderPlain.updateStock(cartDishId, newStock);
          console.log(updateStockData);
          if (!updateStockData) {
            successUpdateStock = Boolean(false);
          }
        }

        // create orderId and place newOrder
        if (successUpdateStock) {
          const orderId = shortid.generate();
          const newOrder = {};
          newOrder.orderId = orderId;
          newOrder.name = name;
          newOrder.phone = phone;
          newOrder.pickup = new Date(pickup);
          newOrder.request = request;
          newOrder.subtotal = subtotal;
          newOrder.subtotalDiscount = subtotalDiscount;
          newOrder.tax = tax;
          newOrder.total = total;
          newOrder.items = JSON.stringify(cartItems);
          console.log(newOrder);

          const addOrderData = await PlaceOrderPlain.placeOrder(newOrder);
          if (addOrderData) {
            console.log(addOrderData);
            user.updateCartItems({});
            this.setState = ({
              name: '',
              phone: '',
              request: '',
              pickup: '',
              touched: {
                name: false,
                phone: false,
                pickup: false,
                request: false,
              },
            });
            // eslint-disable-next-line react/destructuring-assignment
            this.props.history.push(`/ordersuccess/${addOrderData.orderAdd.orderId}`);
          }
        }
      } else {
        e.preventDefault();
      }
    };

    return (
      <div
        className="container"
        style={{
          marginTop: '25px',
          marginBottom: '20px',
          marginLeft: '20px',
          marginRight: '10px',
        }}
      >
        <PanelGroup>
          <Panel header="CONTACT INFORMATION">
            <div className="container">
              <div className="col-12 col-md-9">
                <Form>
                  <Form.Group as={Row}>
                    <Form.Label htmlFor="name" column md={2}>Name</Form.Label>
                    <Col md={10}>
                      <Form.Control
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Your Name"
                        value={name}
                        isValid={errors.name === ''}
                        isInvalid={errors.name !== ''}
                        onBlur={this.handleBlur}
                        onChange={this.handleInputChange}
                      />
                      <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label htmlFor="phone" column md={2}>Phone</Form.Label>
                    <Col md={10}>
                      <Form.Control
                        type="text"
                        id="phone"
                        name="phone"
                        placeholder="(xxx) xxx-xxxx"
                        value={phone}
                        isValid={errors.phone === ''}
                        isInvalid={errors.phone !== ''}
                        onBlur={this.handleBlur}
                        onChange={this.handleInputChange}
                      />
                      <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Form>
              </div>
            </div>
          </Panel>
          <Panel header="SPECIAL REQUEST">
            <div className="container">
              <div className="col-12 col-md-9">
                <Form>
                  <Form.Group as={Row} style={{ marginBottom: '7px' }}>
                    <Form.Label htmlFor="request" column md={2}>Anything We Need to Know</Form.Label>
                    <Col md={10}>
                      <Form.Control
                        as="textarea"
                        id="request"
                        name="request"
                        rows={6}
                        value={request}
                        onBlur={this.handleBlur}
                        onChange={this.handleInputChange}
                      />
                    </Col>
                  </Form.Group>
                </Form>
              </div>
            </div>
          </Panel>
          <Panel header="PICKUP TIME (PST)">
            <div className="container">
              <div className="col-12 col-md-9">
                <h5>
                  Today -&nbsp;&nbsp;
                  <u>{today}</u>
                </h5>
                <Form>
                  <Form.Group as={Row} style={{ marginTop: '10px', marginBottom: '7px' }}>
                    <Form.Label htmlFor="pickup" column md={2}>Select A Timeslot</Form.Label>
                    <Col md={10}>
                      <Form.Control
                        as="select"
                        size="md"
                        id="pickup"
                        name="pickup"
                        onBlur={this.handleBlur}
                        onChange={this.handleInputChange}
                        isValid={errors.pickup === ''}
                        isInvalid={errors.pickup !== ''}
                      >
                        <option value="">&nbsp;&nbsp;&nbsp;</option>
                        {slotOptions}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">{errors.pickup}</Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                  <div className="d-flex justify-content-end" style={{ marginTop: '20px' }}>
                    <div>
                      <LinkContainer to="/cart">
                        <Button
                          size="md"
                          variant="dark"
                        >
                          BACK TO CART
                        </Button>
                      </LinkContainer>
                    </div>
                    <div style={{ marginLeft: '5px' }}>
                      <Button
                        type="submit"
                        size="md"
                        variant="dark"
                        disabled={errors.name !== '' || errors.phone !== '' || errors.pickup !== ''}
                        onClick={onSubmitOrder}
                      >
                        PLACE ORDER
                      </Button>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </Panel>
        </PanelGroup>

      </div>
    );
  }
}

PlaceOrderPlain.contextType = UserContext;
const PlaceOrder = withRouter(PlaceOrderPlain);
delete PlaceOrder.contextType;
// PlaceOrder.fetchStock = PlaceOrderPlain.fetchStock;
// PlaceOrder.updateStock = PlaceOrderPlain.updateStock;
// PlaceOrder.placeOrder = PlaceOrderPlain.placeOrder;
export default PlaceOrder;
