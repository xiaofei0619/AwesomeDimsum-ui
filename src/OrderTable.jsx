import React from 'react';
import { Table } from 'react-bootstrap';
import OrderRow from './OrderRow.jsx';
import './OrderTable.css';

export default function OrderTable({ orders, updateOrder }) {
  const orderRows = orders.map((order, index) => (
    <OrderRow
      key={order.id}
      order={order}
      updateOrder={updateOrder}
      index={index}
    />
  ));
  return (
    <div className="table">
      <Table bordered hover responsive size="sm">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Status</th>
            <th>Pickup Time</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Total Amount</th>
            <th>Update Status</th>
          </tr>
        </thead>
        <tbody>
          {orderRows}
        </tbody>
      </Table>
    </div>
  );
}
