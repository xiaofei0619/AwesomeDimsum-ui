import React from 'react';
import {
  Button, Table,
} from 'react-bootstrap';
import {
  PanelGroup, Panel, Alert,
} from 'rsuite';
import { LinkContainer } from 'react-router-bootstrap';
import { withRouter } from 'react-router-dom';
import graphQLFetch from './graphQLFetch.js';
import store from './store.js';
import UserContext from './UserContext.js';
import CartRow from './CartRow.jsx';

class CartPlain extends React.Component {
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
    const data = await CartPlain.fetchData();
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

    const onSubmit = async (e) => {
      // e.preventDefault();
      console.log('Get in onsubmit');
      const data = await CartPlain.fetchData();
      if (data) {
        const newStockList = data.stockList;

        const newMergeList = [];
        for (let i = 0; i < dishes.length; i += 1) {
          newMergeList.push({
            ...dishes[i],
            ...(newStockList.find(item => item.dishId === dishes[i].dishId)),
          });
        }
        const newCartDishes = newMergeList.filter(
          dish => Object.keys(cartItems).indexOf(dish.dishId.toString()) !== -1,
        );

        let isValid = Boolean(true);
        for (let k = 0; k < newCartDishes.length; k += 1) {
          console.log('Get in onsubmit loop');
          const amount = cartItems[newCartDishes[k].dishId.toString()];
          const { stock } = newCartDishes[k];
          if (amount > stock) {
            isValid = Boolean(false);
          }
        }

        console.log(isValid);
        if (!isValid) {
          e.preventDefault();
          Alert.error('Stock has been updated. Please press refresh button to see the changes!', 5000);
        } else {
          // eslint-disable-next-line react/destructuring-assignment
          this.props.history.push('/placeorder');
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
          minHeight: '600px',
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
                  size="md"
                  variant="dark"
                  onClick={this.loadData}
                >
                  Refresh Cart
                </Button>
              </div>
              <div style={{ marginLeft: '5px' }}>
                <Button
                  size="md"
                  variant="dark"
                  onClick={onSubmit}
                >
                  Fill Pickup Info
                </Button>
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    );
  }
}

CartPlain.contextType = UserContext;
const Cart = withRouter(CartPlain);
delete Cart.contextType;
export default Cart;
