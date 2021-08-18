import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';
import graphQLFetch from './graphQLFetch.js';
import withToast from './withToast.jsx';
import store from './store.js';

class OrderSuccess extends React.Component {
  static async fetchData(match, search, showError) {
    const query = `query orderWithOrderId($orderId: String!) {
      orderWithOrderId(orderId: $orderId) {
        id orderId name phone pickup
      }
    }`;
    const vars = {};
    const { params: { orderId } } = match;
    vars.orderId = orderId.toString();

    const result = await graphQLFetch(query, vars, showError);
    return result;
  }

  constructor(props) {
    super(props);
    const order = store.initialData ? store.initialData.orderWithOrderId : null;
    delete store.initialData;
    this.state = {
      order,
    };
  }

  componentDidMount() {
    const { order } = this.state;
    if (order == null) {
      this.loadData();
    }
  }

  async loadData() {
    const { location: { search }, match, showError } = this.props;
    const data = await OrderSuccess.fetchData(match, search, showError);
    if (data) {
      this.setState({ order: data.orderWithOrderId });
    }
  }

  render() {
    const { order } = this.state;
    if (order === null) {
      return null;
    }

    const { pickup } = order;
    return (
      <div
        className="container"
        style={{
          height: '400px',
          marginTop: '150px',
          flexFlow: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'stretch',
        }}
      >
        <div>
          <h3>Your Order Has Been Placed Successfully!!!</h3>
        </div>
        <div>
          <h4>{`Order Number: ${order.orderId}`}</h4>
        </div>
        <div>
          <h4>{`See you later at: ${pickup.toLocaleString()}`}</h4>
        </div>
        <LinkContainer exact to="/trackorder">
          <Button variant="link">Track Your Order Here</Button>
        </LinkContainer>
      </div>
    );
  }
}

const OrderSuccessWithToast = withToast(OrderSuccess);
OrderSuccessWithToast.fetchData = OrderSuccess.fetchData;

export default OrderSuccessWithToast;
