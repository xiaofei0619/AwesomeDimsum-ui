import React from 'react';
// import { Accordion, Card } from 'react-bootstrap';
import { PanelGroup, Panel } from 'rsuite';
import store from './store.js';
import Dish from './Dish.jsx';
import graphQLFetch from './graphQLFetch.js';
import SearchMenu from './SearchMenu.jsx';

export default class Menu extends React.Component {
  static async fetchData() {
    const data = await graphQLFetch(`query {
      stockList {
        dishId stock
      }
    }`);
    return data;
  }

  constructor(props) {
    super(props);
    const stockList = store.initialData ? store.initialData.stockList : null;
    delete store.initialData;
    this.state = { stockList };
  }

  async componentDidMount() {
    const { stockList } = this.state;
    if (stockList == null) {
      const data = await Menu.fetchData();
      this.setState({ stockList: data.stockList });
    }
  }

  render() {
    const MenuPage = (list) => {
      const steamedDishes = list.filter(dish => dish.category === 'steamed');
      const bakedDishes = list.filter(dish => dish.category === 'baked');
      const friedDishes = list.filter(dish => dish.category === 'fried');
      const panFriedDishes = list.filter(dish => dish.category === 'pan-fried');
      const riceRollCongeeDishes = list.filter(dish => dish.category === 'rice roll-congee');
      const dessertsDishes = list.filter(dish => dish.category === 'desserts');

      const steamedCards = steamedDishes.map(dish => (
        <div key={dish.dishId} className="col-sm-6 col-md-4 col-lg-2 d-flex align-self-stretch">
          <Dish dish={dish} />
        </div>
      ));
      const bakedCards = bakedDishes.map(dish => (
        <div key={dish.dishId} className="col-sm-6 col-md-4 col-lg-2 d-flex align-self-stretch">
          <Dish dish={dish} />
        </div>
      ));
      const friedCards = friedDishes.map(dish => (
        <div key={dish.dishId} className="col-sm-6 col-md-4 col-lg-2 d-flex align-self-stretch">
          <Dish dish={dish} />
        </div>
      ));
      const panFriedCards = panFriedDishes.map(dish => (
        <div key={dish.dishId} className="col-sm-6 col-md-4 col-lg-2 d-flex align-self-stretch">
          <Dish dish={dish} />
        </div>
      ));
      const riceRollCongeeCards = riceRollCongeeDishes.map(dish => (
        <div key={dish.dishId} className="col-sm-6 col-md-4 col-lg-2 d-flex align-self-stretch">
          <Dish dish={dish} />
        </div>
      ));
      const dessertsCards = dessertsDishes.map(dish => (
        <div key={dish.dishId} className="col-sm-6 col-md-4 col-lg-2 d-flex align-self-stretch">
          <Dish dish={dish} />
        </div>
      ));

      return (
        <div className="container">
          {/* <Accordion defaultActiveKey="0">
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                STEAMED 蒸
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <div className="row">
                    {steamedCards}
                  </div>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="1">
                BAKED 焗
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="1">
                <Card.Body>
                  <div className="row">
                    {bakedCards}
                  </div>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="2">
                FRIED 酥炸
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="2">
                <Card.Body>
                  <div className="row">
                    {friedCards}
                  </div>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="3">
                PAN-FRIED 香煎
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="3">
                <Card.Body>
                  <div className="row">
                    {panFriedCards}
                  </div>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="4">
                RICE ROLL-CONGEE 肠粉粥
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="4">
                <Card.Body>
                  <div className="row">
                    {riceRollCongeeCards}
                  </div>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="5">
                DESSERTS 甜品
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="5">
                <Card.Body>
                  <div className="row">
                    {dessertsCards}
                  </div>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion> */}
          <PanelGroup accordion bordered>
            <Panel header="STEAMED 蒸" defaultExpanded>
              <div className="row">
                {steamedCards}
              </div>
            </Panel>
            <Panel header="BAKED 焗">
              <div className="row">
                {bakedCards}
              </div>
            </Panel>
            <Panel header="FRIED 酥炸">
              <div className="row">
                {friedCards}
              </div>
            </Panel>
            <Panel header="PAN-FRIED 香煎">
              <div className="row">
                {panFriedCards}
              </div>
            </Panel>
            <Panel header="RICE ROLL-CONGEE 肠粉粥">
              <div className="row">
                {riceRollCongeeCards}
              </div>
            </Panel>
            <Panel header="DESSERTS 甜品">
              <div className="row">
                {dessertsCards}
              </div>
            </Panel>
          </PanelGroup>
        </div>
      );
    };

    const { stockList } = this.state;
    const dishes = store.menuData;

    if (stockList === null) {
      return (
        <div>
          <div className="row mt-5 mb-3 justify-content-center">
            <div className="col-4 col-lg-1">
              Search Menu
            </div>
            <div className="col-6 col-lg-5">
              <SearchMenu />
            </div>
          </div>
          <div>
            {MenuPage(dishes)}
          </div>
        </div>
      );
    }

    const mergeList = [];
    for (let i = 0; i < dishes.length; i += 1) {
      mergeList.push({
        ...dishes[i],
        ...(stockList.find(item => item.dishId === dishes[i].dishId)),
      });
    }
    return (
      <div style={{ minHeight: '600px', marginBottom: '40px' }}>
        <div className="row mt-5 mb-3 justify-content-center">
          <div className="col-4 col-lg-1">
            Search Menu
          </div>
          <div className="col-6 col-lg-5">
            <SearchMenu />
          </div>
        </div>
        <div>
          {MenuPage(mergeList)}
        </div>
      </div>
    );
  }
}
