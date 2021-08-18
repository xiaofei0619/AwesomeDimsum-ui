import React from 'react';
import URLSearchParams from 'url-search-params';
import {
  Accordion, Card, Pagination,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import OrderFilter from './OrderFilter.jsx';
import OrderTable from './OrderTable.jsx';
import OrderDetail from './OrderDetail.jsx';
import graphQLFetch from './graphQLFetch.js';
import withToast from './withToast.jsx';
import store from './store.js';

const SECTION_SIZE = 5;

function PageLink({
  params, page, activePage, children,
}) {
  params.set('page', page);
  if (page === 0) return React.cloneElement(children, { disabled: true });
  return (
    <LinkContainer
      isActive={() => page === activePage}
      to={{ search: `?${params.toString()}` }}
    >
      {children}
    </LinkContainer>
  );
}

class OrderList extends React.Component {
  static async fetchData(match, search, showError) {
    const params = new URLSearchParams(search);
    const vars = { hasSelection: false, selectedId: 0 };
    if (params.get('status')) vars.status = params.get('status');
    if (params.get('pickupStart')) vars.pickupStart = params.get('pickupStart');
    if (params.get('pickupEnd')) vars.pickupEnd = params.get('pickupEnd');
    if (params.get('search')) vars.search = params.get('search');
    let page = parseInt(params.get('page'), 10);
    if (Number.isNaN(page)) page = 1;
    vars.page = page;

    const { params: { id } } = match;
    const idInt = parseInt(id, 10);
    if (!Number.isNaN(idInt)) {
      vars.hasSelection = true;
      vars.selectedId = idInt;
    }

    const query = `query orderList(
      $status: OrderStatusType
      $pickupStart: GraphQLDate
      $pickupEnd: GraphQLDate
      $search: String
      $page: Int
      $hasSelection: Boolean!
      $selectedId: Int!
    ) {
        orderList (
          status: $status
          pickupStart: $pickupStart
          pickupEnd: $pickupEnd
          search: $search
          page: $page
        ) {
          orders {
            _id id orderId status name phone created
            pickup subtotal subtotalDiscount tax total items request
          }
            pages
        }
          order(id: $selectedId) @include (if: $hasSelection) {
            _id id orderId status name phone created
            pickup subtotal subtotalDiscount tax total items request
        }
      }`;

    const data = await graphQLFetch(query, vars, showError);
    return data;
  }

  constructor(props) {
    super(props);
    const initialData = store.initialData || { orderList: {} };
    const {
      orderList: { orders, pages }, order: selectedOrder,
    } = initialData;

    delete store.initialData;
    this.state = {
      orders,
      pages,
      selectedOrder,
    };
    this.updateOrder = this.updateOrder.bind(this);
  }

  componentDidMount() {
    const { orders } = this.state;
    if (orders == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    console.log('Order List...');
    console.log(this.props);
    const {
      location: { search: prevSearch },
      match: { params: { id: prevId } },
    } = prevProps;

    const {
      location: { search },
      match: { params: { id } },
    } = this.props;

    if (prevSearch !== search || prevId !== id) {
      this.loadData();
    }
  }

  async loadData() {
    const { location: { search }, match, showError } = this.props;
    const data = await OrderList.fetchData(match, search, showError);
    if (data) {
      this.setState({
        orders: data.orderList.orders,
        pages: data.orderList.pages,
        selectedOrder: data.order,
      });
    }
  }

  async updateOrder(index, newStatus) {
    const query = `mutation orderUpdate($orderId: String!, $status: OrderStatusType!) {
      orderUpdate(orderId: $orderId, status: $status) {
        _id id orderId status name phone created
        pickup subtotal subtotalDiscount tax total items request
      }
    }`;
    const { orders } = this.state;
    const { showError } = this.props;
    const data = await graphQLFetch(
      query,
      { orderId: orders[index].orderId, status: newStatus },
      showError,
    );
    if (data) {
      this.setState((prevState) => {
        const newList = [...prevState.orders];
        newList[index] = data.orderUpdate;
        return { orders: newList };
      });
    } else {
      this.loadData();
    }
  }

  render() {
    const { orders } = this.state;
    console.log('OrderList ... current orders are ...');
    console.log(orders);
    if (orders == null) return null;

    const { selectedOrder, pages } = this.state;
    const { location: { search } } = this.props;

    const params = new URLSearchParams(search);
    let page = parseInt(params.get('page'), 10);
    if (Number.isNaN(page)) page = 1;

    const startPage = Math.floor((page - 1) / SECTION_SIZE) * SECTION_SIZE + 1;
    const endPage = startPage + SECTION_SIZE - 1;
    const prevSection = startPage === 1 ? 0 : startPage - SECTION_SIZE;
    const nextSection = endPage >= pages ? 0 : startPage + SECTION_SIZE;

    const items = [];
    for (let i = startPage; i <= Math.min(endPage, pages); i += 1) {
      params.set('page', i);
      items.push((
        <PageLink key={i} params={params} activePage={page} page={i}>
          <Pagination.Item>{i}</Pagination.Item>
        </PageLink>
      ));
    }

    return (
      <div className="container" style={{ marginTop: '25px', marginBottom: '40px', minHeight: '600px' }}>
        <React.Fragment>
          <Accordion>
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                Filter
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <OrderFilter urlBase="/orders" />
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <hr />
          <OrderTable
            orders={orders}
            updateOrder={this.updateOrder}
          />
          <OrderDetail order={selectedOrder} />
          <Pagination style={{ marginTop: '15px' }}>
            <PageLink params={params} page={prevSection}>
              <Pagination.Item>{'<'}</Pagination.Item>
            </PageLink>
            {items}
            <PageLink params={params} page={nextSection}>
              <Pagination.Item>{'>'}</Pagination.Item>
            </PageLink>
          </Pagination>
        </React.Fragment>
      </div>
    );
  }
}

const OrderListWithToast = withToast(OrderList);
OrderListWithToast.fetchData = OrderList.fetchData;

export default OrderListWithToast;
