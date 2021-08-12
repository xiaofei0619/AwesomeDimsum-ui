import React from 'react';
import {
  Button, Table,
} from 'react-bootstrap';
import {
  PanelGroup, Panel,
} from 'rsuite';
import { LinkContainer } from 'react-router-bootstrap';
import graphQLFetch from './graphQLFetch.js';
import store from './store.js';
import UserContext from './UserContext.js';
import CartRow from './CartRow.jsx';

class Cart extends React.Component {
  static async fetchData() {
    const data = await graphQLFetch(`query {
      stockList {
        dishId stock
      }
    }`);
    return data;
  }

  constructor(props) {
    super(props);
    const stockList = store.initialData ? store.initialData.stockList : null;
    delete store.initialData;
    this.state = {
      stockList,
    };
    this.loadData = this.loadData.bind(this);
  }

  // async componentDidMount() {
  //   const { stockList } = this.state;
  //   if (stockList == null) {
  //     const data = await Cart.fetchData();
  //     this.setState({
  //       stockList: data.stockList,
  //     });
  //   }
  // }

  async componentDidMount() {
    const { stockList } = this.state;
    if (stockList == null) {
      this.loadData();
    }
  }

  async loadData() {
    const data = await Cart.fetchData();
    if (data) {
      this.setState({
        stockList: data.stockList,
      });
    }
  }

  // handleInputChange(event) {
  //   const { target } = event;
  //   const { value } = target;
  //   const { name } = target;
  //   this.setState({
  //     [name]: value,
  //   });
  // }

  render() {
    const user = this.context;
    const { cartItems } = user;
    if (Object.keys(cartItems).length === 0) {
      return (
        <div className="container" style={{ width: '400px', height: '400px', marginTop: '150px' }}>
          <div className="row justify-content-center">
            <h4>Your Cart Is Empty. Start Ordering ?</h4>
            <LinkContainer exact to="/menu">
              <Button variant="link">Check Menu</Button>
            </LinkContainer>
          </div>
        </div>
      );
    }

    const { stockList } = this.state;
    if (stockList === null) {
      return null;
    }
    const dishes = store.menuData;
    const mergeList = [];
    for (let i = 0; i < dishes.length; i += 1) {
      mergeList.push({
        ...dishes[i],
        ...(stockList.find(item => item.dishId === dishes[i].dishId)),
      });
    }

    const cartDishes = mergeList.filter(
      dish => Object.keys(cartItems).indexOf(dish.dishId.toString()) !== -1,
    );

    console.log('???Stock List???????');
    console.log(stockList);
    console.log(mergeList);
    console.log(cartDishes);

    const cartRows = cartDishes.map(dish => (
      <CartRow
        key={dish.id}
        dish={dish}
      />
    ));

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
          <Panel header="ORDER SUMMARY">
            <Table bordered responsive size="sm">
              <thead>
                <tr>
                  <th>Dish Name</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Select Amount</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {cartRows}
              </tbody>
            </Table>

          </Panel>
          {/* <Panel>
            <Form>
              <Form.Group as={Row}>
                <Form.Label htmlFor="request" column md={2}>Special Request</Form.Label>
                <Col md={10}>
                  <Form.Control
                    as="textarea"
                    id="comment"
                    name="comment"
                    rows={6}
                    value={request}
                    onChange={this.handleInputChange}
                  />
                </Col>
              </Form.Group>
            </Form>
          </Panel> */}
          <Panel>
            <div className="row">
              <div className="col-10 col-md-8">
                <h6>Subtotal</h6>
              </div>
              <div className="col-2 col-md-2">
                <h6>{`$${subtotal.toFixed(2)}`}</h6>
              </div>
            </div>
            <div className="row">
              <div className="col-10 col-md-8">
                <h6>Subtotal w/Discount(15% Off Subtotal Over $60)</h6>
              </div>
              <div className="col-2 col-md-2">
                <h6>{`$${subtotalDiscount.toFixed(2)}`}</h6>
              </div>
            </div>
            <div className="row">
              <div className="col-10 col-md-8">
                <h6>Tax</h6>
              </div>
              <div className="col-2 col-md-2">
                <h6>{`$${tax.toFixed(2)}`}</h6>
              </div>
            </div>
            <div className="row">
              <div className="col-10 col-md-8">
                <h6>Total</h6>
              </div>
              <div className="col-2 col-md-2">
                <h6>{`$${total.toFixed(2)}`}</h6>
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <div>
                <Button
                  size="sm"
                  variant="dark"
                  onClick={this.loadData}
                >
                  Refresh Cart
                </Button>
              </div>
              <div style={{ marginLeft: '5px' }}>
                <Button
                  size="sm"
                  variant="dark"
                >
                  Fill Pickup Info
                </Button>
              </div>
              <div />
            </div>
          </Panel>
        </PanelGroup>
      </div>
    );
  }
}

Cart.contextType = UserContext;
export default Cart;
