import React from 'react';
import URLSearchParams from 'url-search-params';
import { withRouter } from 'react-router-dom';
import {
  Button, Row, Col, Form,
} from 'react-bootstrap';

class StockFilter extends React.Component {
  constructor({ location: { search } }) {
    super();
    const params = new URLSearchParams(search);
    this.state = {
      searchStr: params.get('search') || '',
      changed: false,
    };

    this.onChangeSearch = this.onChangeSearch.bind(this);
    this.showOriginalFilter = this.showOriginalFilter.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { location: { search: prevSearch } } = prevProps;
    const { location: { search } } = this.props;
    if (prevSearch !== search) {
      this.showOriginalFilter();
    }
  }

  onChangeSearch(e) {
    this.setState({ searchStr: e.target.value, changed: true });
  }

  showOriginalFilter() {
    const { location: { search } } = this.props;
    const params = new URLSearchParams(search);
    this.setState({
      searchStr: params.get('search') || '',
      changed: false,
    });
  }

  applyFilter() {
    const { searchStr } = this.state;
    const { history, urlBase } = this.props;

    const params = new URLSearchParams();
    if (searchStr) params.set('search', searchStr);

    const search = params.toString() ? `?${params.toString()}` : '';
    history.push({ pathname: urlBase, search });
  }

  render() {
    const {
      searchStr, changed,
    } = this.state;
    console.log('Current state is..');
    console.log(this.state);

    return (
      <div className="container">
        <Row>
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
                    placeholder="Search Menu Item..."
                    value={searchStr}
                    onChange={this.onChangeSearch}
                  />
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
          <div style={{ marginLeft: '10px' }}>
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

export default withRouter(StockFilter);
