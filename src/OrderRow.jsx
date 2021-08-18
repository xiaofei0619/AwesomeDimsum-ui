import React from 'react';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Button, Tooltip, OverlayTrigger, Form, ButtonToolbar,
} from 'react-bootstrap';
import { Modal } from 'rsuite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import UserContext from './UserContext.js';

class OrderRowPlain extends React.Component {
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

    const { updateOrder, index } = this.props;

    const form = document.forms.statusUpdate;
    const newStatus = form.status.value;
    updateOrder(index, newStatus);
  }

  render() {
    const {
      order, location: { search },
    } = this.props;
    console.log('Logging the specific Order in the order row//');
    console.log(order);

    const user = this.context;
    const disabled = !user.signedIn;

    const selectLocation = { pathname: `/orders/${order.id}`, search };
    const editTooltip = (
      <Tooltip id="edit-tooltip" placement="top">Update Order Status</Tooltip>
    );

    const tableRow = (
      <tr>
        <td>{order.orderId}</td>
        <td>{order.status}</td>
        <td>{order.pickup.toLocaleString()}</td>
        <td>{order.name}</td>
        <td>{order.phone}</td>
        <td>{order.total}</td>
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
        <LinkContainer to={selectLocation}>
          {tableRow}
        </LinkContainer>
        <Modal keyboard show={showing} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Update Order Status</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form name="statusUpdate">
              <Form.Group>
                <Form.Label htmlFor="status">Change Status To:</Form.Label>
                <Form.Control
                  size="sm"
                  as="select"
                  id="status"
                  name="status"
                >
                  <option value="New">New</option>
                  <option value="InProgress">InProgress</option>
                  <option value="ReadyForPickup">ReadyForPickup</option>
                  <option value="Complete">Complete</option>
                  <option value="Cancelled">Cancelled</option>
                </Form.Control>
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

OrderRowPlain.contextType = UserContext;
const OrderRow = withRouter(OrderRowPlain);
delete OrderRow.contextType;

export default OrderRow;
