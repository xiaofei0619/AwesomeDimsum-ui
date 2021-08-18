import React from 'react';
import {
  Button, Form, Col, Row,
} from 'react-bootstrap';
import {
  Alert, PanelGroup,
} from 'rsuite';
import graphQLFetch from './graphQLFetch.js';
import OrderDetail from './OrderDetail.jsx';

class OrderTracker extends React.Component {
  static async orderStatus(name, orderId) {
    console.log('orderStatus called');
    const query = `query orderStatus(
      $name: String!,
      $orderId: String!
    ){
      orderStatus (
        name: $name,
        orderId: $orderId
      ) {
        _id id orderId status items subtotal subtotalDiscount tax total
        request name phone created pickup
      }
    }`;
    const data = await graphQLFetch(query, { name, orderId });
    return data;
  }

  static async orderStatusList(name, phone) {
    console.log('orderStatusList called');
    const query = `query orderStatusList(
      $name: String!,
      $phone: String!
    ){
      orderStatusList (
        name: $name,
        phone: $phone
      ) {
        _id id orderId status items subtotal subtotalDiscount tax total
        request name phone created pickup
      }
    }`;
    const data = await graphQLFetch(query, { name, phone });
    return data;
  }

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      phone: '',
      orderId: '',
      touched: {
        name: false,
        phone: false,
        orderId: false,
      },
      trackResult: [],
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

  validate(name, phone, orderId) {
    const errors = {
      name: '',
      phone: '',
      orderId: '',
    };

    // eslint-disable-next-line react/destructuring-assignment
    if (!this.state.touched.name) {
      errors.name = 'Name can not be blank';
    }
    // eslint-disable-next-line react/destructuring-assignment
    if (!this.state.touched.phone && !this.state.touched.orderId) {
      errors.phone = 'Either Phone or OrderId must be entered';
      errors.orderId = 'Either Phone or OrderId must be entered';
    }

    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.touched.name && name.length < 3) {
      errors.name = 'Please enter a name with at least 3 characters';
    // eslint-disable-next-line react/destructuring-assignment
    } else if (this.state.touched.name && name.length > 20) {
      errors.name = 'Please enter a name with no longer than 20 characters';
    }

    const phoneno = /^\(\d\d\d\)\s\d\d\d-\d\d\d\d$/;
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.touched.phone && phone.match(phoneno) === null) {
      errors.phone = 'Phone number must in format: (xxx) xxx-xxxx';
    }

    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.touched.orderId && orderId.length < 7) {
      errors.orderId = 'OrderId has no less than 7 characters';
    // eslint-disable-next-line react/destructuring-assignment
    } else if (this.state.touched.orderId && orderId.length > 14) {
      errors.orderId = 'OrderId has no more than 14 characters';
    }
    return errors;
  }

  render() {
    console.log('Current ------ State');
    console.log(this.state);
    const {
      name, phone, orderId, trackResult,
    } = this.state;
    const errors = this.validate(name, phone, orderId);

    const onSubmitTrack = async (e) => {
      e.preventDefault();
      console.log('Get in onSubmitTrack method');
      if (name !== '' && phone !== '') {
        // fetch order history
        const orderHistory = await OrderTracker.orderStatusList(name, phone);
        if (orderHistory) {
          console.log(orderHistory);
          const { orderStatusList } = orderHistory;
          this.setState({ trackResult: orderStatusList });
        } else {
          Alert.error('Do not find any match for the given name and phone number.', 5000);
        }
      } else if (name !== '' && orderId !== '' && phone === '') {
        // fetch specific order
        const order = await OrderTracker.orderStatus(name, orderId);
        if (order) {
          console.log(order);
          const orderResult = [];
          orderResult.push(order.orderStatus);
          this.setState({ trackResult: orderResult });
        } else {
          Alert.error('Do not find any match for the given name and order id.', 5000);
        }
      }
      this.setState({
        name: '',
        phone: '',
        orderId: '',
        touched: {
          name: false,
          phone: false,
          orderId: false,
        },
      });
    };

    const orderDetails = trackResult.map(
      (order, index) => <OrderDetail key={index.toString()} order={order} />,
    );

    return (
      <div
        className="container"
        style={{
          marginTop: '45px',
          marginBottom: '40px',
          marginLeft: '20px',
          marginRight: '10px',
          minHeight: '600px',
        }}
      >
        <div className="row d-flex justify-content-between">
          <div className="col-12 col-md-4 col-lg-5">
            <Form>
              <Form.Group as={Row} style={{ marginBottom: '8px' }}>
                <Form.Label htmlFor="name" column md={3}>Name</Form.Label>
                <Col md={9}>
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
              <Form.Group as={Row} style={{ marginBottom: '8px' }}>
                <Form.Label htmlFor="phone" column md={3}>Phone</Form.Label>
                <Col md={9}>
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
              <Form.Group as={Row} style={{ marginBottom: '8px' }}>
                <Form.Label htmlFor="orderId" column md={3}>Order ID</Form.Label>
                <Col md={9}>
                  <Form.Control
                    type="text"
                    id="orderId"
                    name="orderId"
                    placeholder="Order ID"
                    value={orderId}
                    isValid={errors.orderId === ''}
                    isInvalid={errors.orderId !== ''}
                    onBlur={this.handleBlur}
                    onChange={this.handleInputChange}
                  />
                  <Form.Control.Feedback type="invalid">{errors.orderId}</Form.Control.Feedback>
                </Col>
              </Form.Group>
              <h6>Note: To track a specific order, please enter your name and order id.</h6>
              <h6>
                Note: If you do not remember order id, please enter your name and phone number to
                get the entire order history.
              </h6>
              <div className="d-flex justify-content-end" style={{ marginTop: '10px' }}>
                <div>
                  <Button
                    type="submit"
                    size="md"
                    variant="dark"
                    disabled={!(errors.name === '' && errors.phone === '') && !(errors.name === '' && errors.orderId === '')}
                    onClick={onSubmitTrack}
                  >
                    TRACK MY ORDER
                  </Button>
                </div>
              </div>
            </Form>
          </div>
          <div className="col-12 col-md-7 col-lg-6" style={{ marginLeft: '10px' }}>
            <PanelGroup accordion bordered>
              {orderDetails}
            </PanelGroup>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderTracker;
