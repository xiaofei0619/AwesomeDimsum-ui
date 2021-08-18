import React from 'react';
import { Panel } from 'rsuite';
import store from './store.js';

export default function IssueDetail({ order }) {
  if (order) {
    const dishes = store.menuData;
    const orderItems = JSON.parse(order.items);

    const orderDishes = dishes.filter(
      dish => Object.keys(orderItems).indexOf(dish.dishId.toString()) !== -1,
    );
    for (let i = 0; i < orderDishes.length; i += 1) {
      orderDishes[i].amount = orderItems[orderDishes[i].dishId];
    }

    const dishShow = orderDishes.map(
      (orderDish, index) => <p key={index.toString()}>{`${orderDish.name} x ${orderDish.amount}`}</p>,
    );

    return (
      <Panel header={`ORDER NUMBER: ${order.orderId}`} bordered>
        <div className="container">
          <h6>Order Status</h6>
          <p>{order.status}</p>
        </div>
        <div className="container" style={{ marginTop: '15px' }}>
          <h6>Order Items</h6>
          {dishShow}
        </div>
        <div className="container" style={{ marginTop: '15px' }}>
          <h6>Order Info</h6>
          <p>{`Subtotal:               $${order.subtotal}`}</p>
          <p>{`Subtotal w/Discount:    $${order.subtotalDiscount}`}</p>
          <p>{`Tax:                    $${order.tax}`}</p>
          <p>{`Total:                  $${order.total}`}</p>
          <p>{`Order Placed Time:      ${order.created.toLocaleString()} PST`}</p>
          <p>{`Order PickUp Time:      ${order.pickup.toLocaleString()} PST`}</p>
          <p>{`Special Request:        ${order.request}`}</p>
        </div>
        <div className="container" style={{ marginTop: '15px' }}>
          <h6>Contact Info</h6>
          <p>{`Name:         ${order.name}`}</p>
          <p>{`Phone:        ${order.phone}`}</p>
        </div>
      </Panel>
    );
  }
  return null;
}
