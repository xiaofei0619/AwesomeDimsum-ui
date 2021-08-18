import React from 'react';
import { Table } from 'react-bootstrap';
import StockRow from './StockRow.jsx';
import './OrderTable.css';

export default function StockTable({ mergeList, updateStock }) {
  const stockRows = mergeList.map((dish, index) => (
    <StockRow
      key={dish.id}
      dish={dish}
      updateStock={updateStock}
      index={index}
    />
  ));
  return (
    <div className="table">
      <Table bordered hover responsive size="sm">
        <thead>
          <tr>
            <th>Dish ID</th>
            <th>Dish Name</th>
            <th>Category</th>
            <th>Current Stock</th>
            <th>Update Stock</th>
          </tr>
        </thead>
        <tbody>
          {stockRows}
        </tbody>
      </Table>
    </div>
  );
}
