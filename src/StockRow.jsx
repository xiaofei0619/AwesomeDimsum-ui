import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Button, Tooltip, OverlayTrigger, Form, ButtonToolbar,
} from 'react-bootstrap';
import { Modal, InputNumber } from 'rsuite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import UserContext from './UserContext.js';

class StockRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  showModal() {
    this.setState({ showing: true });
  }

  hideModal() {
    this.setState({ showing: false });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.hideModal();

    const { updateStock, index } = this.props;

    const form = document.forms.stockUpdate;
    const newStock = form.stock.value;
    updateStock(index, newStock);
  }

  render() {
    const { dish } = this.props;

    const user = this.context;
    const disabled = !user.signedIn;

    const editTooltip = (
      <Tooltip id="edit-tooltip" placement="top">Update Dish Stock</Tooltip>
    );

    const tableRow = (
      <tr>
        <td>{dish.dishId}</td>
        <td>{dish.name}</td>
        <td>{dish.category}</td>
        <td>{dish.stock}</td>
        <td>
          <OverlayTrigger delayShow={1000} overlay={editTooltip}>
            <Button disabled={disabled} size="sm" onClick={this.showModal}>
              <FontAwesomeIcon icon={faEdit} size="sm" />
            </Button>
          </OverlayTrigger>
        </td>
      </tr>
    );

    const { showing } = this.state;

    return (
      <React.Fragment>
        {tableRow}
        <Modal keyboard show={showing} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Update Dish Stock</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form name="stockUpdate">
              <Form.Group>
                <Form.Label htmlFor="stock">Change Stock Number To:</Form.Label>
                {/* <Form.Control
                  size="sm"
                  as="select"
                  id="status"
                  name="status"
                > */}
                <InputNumber
                  id="stock"
                  name="stock"
                  min={0}
                  step={1}
                />
                {/* </Form.Control> */}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <Button
                type="button"
                variant="dark"
                onClick={this.handleSubmit}
              >
                Confirm
              </Button>
              <Button variant="link" onClick={this.hideModal}>Cancel</Button>
            </ButtonToolbar>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

StockRow.contextType = UserContext;
// const OrderRow = withRouter(OrderRowPlain);
// delete OrderRow.contextType;

export default StockRow;
