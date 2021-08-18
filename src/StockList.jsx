import React from 'react';
import URLSearchParams from 'url-search-params';
import {
  Accordion, Card,
} from 'react-bootstrap';

import StockFilter from './StockFilter.jsx';
import StockTable from './StockTable.jsx';
import graphQLFetch from './graphQLFetch.js';
import withToast from './withToast.jsx';
import store from './store.js';

class StockList extends React.Component {
  static async fetchData(match, search, showError) {
    const params = new URLSearchParams(search);
    const vars = {};
    let query;
    if (params.get('search')) {
      vars.search = params.get('search');
      query = `query menuList($search: String) {
        menuList(search: $search) {
          id dishId name image category price description
        }
        stockList {
          dishId stock
        }
      }`;
    } else {
      query = `query {
        stockList {
          dishId stock
        }
      }`;
    }

    const data = await graphQLFetch(query, vars, showError);
    return data;
  }

  constructor(props) {
    super(props);

    const menuList = store.initialData?.menuList ? store.initialData.menuList : store.menuData;
    const stockList = store.initialData ? store.initialData.stockList : null;

    delete store.initialData;
    this.state = {
      menuList, stockList,
    };
    this.updateStock = this.updateStock.bind(this);
  }

  componentDidMount() {
    const { stockList } = this.state;
    if (stockList == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: prevSearch },
    } = prevProps;

    const {
      location: { search },
    } = this.props;

    if (prevSearch !== search) {
      this.loadData();
    }
  }

  async loadData() {
    const { location: { search }, match, showError } = this.props;
    const data = await StockList.fetchData(match, search, showError);

    if(data.stockList) {
      this.setState({
        stockList: data.stockList,
      });
    }
    if(data?.menuList) {
      this.setState({
        menuList: data.menuList,
      });
    } else {
      this.setState({
        menuList: store.menuData,
      });
    }
  }

  async updateStock(index, newStock) {
    console.log('updateStock called');
    const query = `mutation stockUpdate(
        $dishId: Int!,
        $stock: Int!
      ){
        stockUpdate (
          dishId: $dishId,
          stock: $stock
        ) {
          dishId stock
        }
      }`;
    const { menuList, stockList } = this.state;
    const updateDishId = menuList[index].dishId;
    const { showError } = this.props;
    const data = await graphQLFetch(
      query,
      { dishId: updateDishId, stock: newStock },
      showError,
    );
    if (data) {
      console.log('During UpdateStock callback function/');
      console.log(data);

      const newList = [...stockList];
      console.log(newList);
      console.log(Object.keys(newList));

      for (let i = 0; i < newList.length; i += 1) {
        if (newList[i].dishId === updateDishId) {
          newList[i].stock = data.stockUpdate.stock;
        }
      }
      this.setState({ stockList: newList });
    } else {
      this.loadData();
    }
  }

  render() {
    const { stockList } = this.state;
    if (stockList === null) {
      console.log('StockList is null, so it is here');
      return null;
    }
    console.log('in the test render!!!');
    console.log(stockList);

    const { menuList } = this.state;
    const mergeList = [];
    for (let i = 0; i < menuList.length; i += 1) {
      mergeList.push({
        ...menuList[i],
        ...(stockList.find(item => item.dishId === menuList[i].dishId)),
      });
    }
    console.log(mergeList);

    return (
      <div className="container" style={{ marginTop: '25px', marginBottom: '40px' }}>
        <React.Fragment>
          <Accordion>
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                Search Bar
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <StockFilter urlBase="/stocks" />
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <hr />
          <StockTable
            mergeList={mergeList}
            updateStock={this.updateStock}
          />
        </React.Fragment>
      </div>
    );
  }
}

const StockListWithToast = withToast(StockList);
StockListWithToast.fetchData = StockList.fetchData;

export default StockListWithToast;
