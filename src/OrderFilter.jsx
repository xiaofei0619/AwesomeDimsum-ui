/* eslint-disable prefer-template */
import React from 'react';
import URLSearchParams from 'url-search-params';
import { withRouter } from 'react-router-dom';
import {
  Button, Row, Col, Form,
} from 'react-bootstrap';
import { InputGroup, DatePicker } from 'rsuite';

class OrderFilter extends React.Component {
  constructor({ location: { search } }) {
    super();
    const params = new URLSearchParams(search);
    this.state = {
      status: params.get('status') || '',
      pickupStart: params.get('pickupStart') ? new Date(params.get('pickupStart')) : undefined,
      pickupEnd: params.get('pickupEnd') ? new Date(params.get('pickupEnd')) : undefined,
      searchStr: params.get('search') || '',
      changed: false,
    };

    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onChangeSearch = this.onChangeSearch.bind(this);
    this.showOriginalFilter = this.showOriginalFilter.bind(this);
    this.onChangePickupStart = this.onChangePickupStart.bind(this);
    this.onChangePickupEnd = this.onChangePickupEnd.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.onCleanPickupStart = this.onCleanPickupStart.bind(this);
    this.onCleanPickupEnd = this.onCleanPickupEnd.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { location: { search: prevSearch } } = prevProps;
    const { location: { search } } = this.props;
    if (prevSearch !== search) {
      this.showOriginalFilter();
    }
  }

  onChangeStatus(e) {
    this.setState({ status: e.target.value, changed: true });
  }

  onChangeSearch(e) {
    this.setState({ searchStr: e.target.value, changed: true });
  }

  onChangePickupStart(time) {
    // value of DateTimePicker is in type of Date, change to string and save to state
    console.log('In onChangePickup...');
    console.log(time);
    // const pickupStartTime = new Date(time);
    // const year = pickupStartTime.getFullYear();
    // const month = ('0' + (pickupStartTime.getMonth() + 1)).slice(-2);
    // const day = ('0' + pickupStartTime.getDate()).slice(-2);
    // const hour = ('0' + pickupStartTime.getHours()).slice(-2);
    // const minute = ('0' + pickupStartTime.getMinutes()).slice(-2);
    // const second = ('0' + pickupStartTime.getSeconds()).slice(-2);
    // const pickupStart = `${year}-${month}-${day}T${hour}:${minute}:${second}-07:00`;
    this.setState({ pickupStart: new Date(time), changed: true });
  }

  onChangePickupEnd(time) {
    // value of DateTimePicker is in type of Date, change to string and save to state
    // const pickupEndTime = e.target.value;
    // const year = pickupEndTime.getFullYear();
    // const month = ('0' + (pickupEndTime.getMonth() + 1)).slice(-2);
    // const day = ('0' + pickupEndTime.getDate()).slice(-2);
    // const hour = ('0' + pickupEndTime.getHours()).slice(-2);
    // const minute = ('0' + pickupEndTime.getMinutes()).slice(-2);
    // const second = ('0' + pickupEndTime.getSeconds()).slice(-2);
    // const pickupEnd = `${year}-${month}-${day}T${hour}:${minute}:${second}-08:00`;
    this.setState({ pickupEnd: new Date(time), changed: true });
  }

  onCleanPickupStart() {
    this.setState({
      pickupStart: undefined,
    });
  }

  onCleanPickupEnd() {
    this.setState({
      pickupEnd: undefined,
    });
  }

  showOriginalFilter() {
    const { location: { search } } = this.props;
    const params = new URLSearchParams(search);
    this.setState({
      status: params.get('status') || '',
      pickupStart: params.get('pickupStart') ? new Date(params.get('pickupStart')) : undefined,
      pickupEnd: params.get('pickupEnd') ? new Date(params.get('pickupEnd')) : undefined,
      searchStr: params.get('search') || '',
      changed: false,
    });
  }

  applyFilter() {
    const {
      status, pickupStart, pickupEnd, searchStr,
    } = this.state;
    const { history, urlBase } = this.props;

    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (pickupStart) params.set('pickupStart', pickupStart);
    if (pickupEnd) params.set('pickupEnd', pickupEnd);
    if (searchStr) params.set('search', searchStr);

    const search = params.toString() ? `?${params.toString()}` : '';
    history.push({ pathname: urlBase, search });
  }

  render() {
    const {
      status, pickupStart, pickupEnd, searchStr, changed,
    } = this.state;
    console.log('Current state is..');
    console.log(this.state);

    const startTimeTest = new Date(pickupStart);
    console.log(startTimeTest.getTime());
    console.log(startTimeTest.getHours());
    return (
      <div className="container">
        <Row>
          <Col sm={6} lg={4}>
            <Form>
              <Form.Group as={Row}>
                <Form.Label htmlFor="status" column md={3}>Status:</Form.Label>
                <Col md={9}>
                  <Form.Control
                    size="sm"
                    as="select"
                    id="status"
                    name="status"
                    value={status}
                    onChange={this.onChangeStatus}
                  >
                    <option value="">(All)</option>
                    <option value="New">New</option>
                    <option value="InProgress">InProgress</option>
                    <option value="ReadyForPickup">ReadyForPickup</option>
                    <option value="Complete">Complete</option>
                    <option value="Cancelled">Cancelled</option>
                  </Form.Control>
                </Col>
              </Form.Group>
            </Form>
          </Col>
          <Col sm={6} lg={4}>
            <Form>
              <Form.Group as={Row}>
                <Form.Label htmlFor="search" column md={3}>Search:</Form.Label>
                <Col md={9}>
                  <Form.Control
                    size="sm"
                    type="text"
                    id="search"
                    name="search"
                    placeholder="Name or OrderId"
                    value={searchStr}
                    onChange={this.onChangeSearch}
                  />
                </Col>
              </Form.Group>
            </Form>
          </Col>
          <Col sm={12} style={{ marginTop: '10px' }}>
            <Form>
              <Form.Group as={Row}>
                <Form.Label column md={3}>Pickup Time Between:</Form.Label>
                <Col md={7}>
                  <InputGroup style={{ width: 460 }}>
                    <DatePicker
                      format="YYYY-MM-DD HH:mm:ss"
                      block
                      appearance="subtle"
                      value={pickupStart}
                      onChange={this.onChangePickupStart}
                      onClean={this.onCleanPickupStart}
                    />
                    <InputGroup.Addon>And</InputGroup.Addon>
                    <DatePicker
                      format="YYYY-MM-DD HH:mm:ss"
                      block
                      appearance="subtle"
                      value={pickupEnd}
                      onChange={this.onChangePickupEnd}
                      onClean={this.onCleanPickupEnd}
                    />
                  </InputGroup>
                </Col>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <div className="d-flex justify-content-end" style={{ marginTop: '20px' }}>
          <div>
            <Button variant="dark" type="button" onClick={this.applyFilter}>
              Apply
            </Button>
          </div>
          <div style={{ marginLeft: '5px' }}>
            <Button
              variant="dark"
              type="button"
              onClick={this.showOriginalFilter}
              disabled={!changed}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(OrderFilter);
