import React from 'react';
import URLSearchParams from 'url-search-params';
import {
  Card, Pagination, Button,
} from 'react-bootstrap';
import { InputNumber, Alert } from 'rsuite';
import { LinkContainer } from 'react-router-bootstrap';

import graphQLFetch from './graphQLFetch.js';
import withToast from './withToast.jsx';
import store from './store.js';
import CommentList from './CommentList.jsx';
import UserContext from './UserContext.js';
import AddComment from './AddComment.jsx';

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

class OrderDish extends React.Component {
  static async fetchData(match, search, showError) {
    const vars = {};
    const { params: { dishId } } = match;
    const dishIdInt = parseInt(dishId, 10);
    if (!Number.isNaN(dishIdInt)) {
      vars.dishId = dishIdInt;
    }

    const params = new URLSearchParams(search);
    let page = parseInt(params.get('page'), 10);
    if (Number.isNaN(page)) page = 1;
    vars.page = page;

    const query = `query dishDetail(
      $dishId: Int!
      $page: Int
    ) {
      commentList (
        dishId: $dishId
        page: $page
      ) {
        comments {
          id dishId rating comment
          author date
        }
        pages
      }
      dish(dishId: $dishId) {
        dishId name image price description
      }
      stock(dishId: $dishId)
    }`;

    const data = await graphQLFetch(query, vars, showError);
    return data;
  }

  constructor(props) {
    super(props);
    const dish = store.initialData ? store.initialData.dish : null;
    const stock = store.initialData ? store.initialData.stock : 0;
    const comments = store.initialData ? store.initialData.commentList.comments : null;
    const pages = store.initialData ? store.initialData.commentList.pages : 0;
    delete store.initialData;

    this.state = {
      dish,
      stock,
      comments,
      pages,
      selectAmount: 1,
    };
    this.handleInputAmountChange = this.handleInputAmountChange.bind(this);
    this.handleAddComment = this.handleAddComment.bind(this);
  }

  componentDidMount() {
    const { comments } = this.state;
    if (comments == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: prevSearch },
      match: { params: { dishId: prevDishId } },
    } = prevProps;

    const {
      location: { search },
      match: { params: { dishId } },
    } = this.props;

    if (prevSearch !== search || prevDishId !== dishId) {
      this.loadData();
    }
  }

  async loadData() {
    const { location: { search }, match, showError } = this.props;
    const data = await OrderDish.fetchData(match, search, showError);
    if (data) {
      this.setState({
        dish: data.dish,
        stock: data.stock,
        comments: data.commentList.comments,
        pages: data.commentList.pages,
        selectAmount: 1,
      });
    }
  }

  async handleAddComment(newComment) {
    const query = `mutation addNewComment(
      $comment: CommentInputs!
    ){
      commentAdd (
        comment: $comment
      ) {
        id dishId rating comment author date
      }
    }`;
    const { showError } = this.props;
    const data = await graphQLFetch(query, { comment: newComment }, showError);
    if (data) {
      this.loadData();
    } else {
      console.log('Errors during submitting comment');
      this.loadData();
    }
  }

  handleInputAmountChange(selectAmount) {
    const amountInt = parseInt(selectAmount, 10);
    this.setState({
      selectAmount: amountInt,
    });
  }

  render() {
    const { comments, dish } = this.state;
    if (comments == null || dish == null) return null;

    const { stock, pages } = this.state;
    const { location: { search } } = this.props;

    const { dish: { dishId } } = this.state;
    const { match: { params: { dishId: propsDishId } } } = this.props;
    if (dishId == null) {
      if (propsDishId != null) {
        return <h3>{`Dish with dishID ${propsDishId} not found.`}</h3>;
      }
      return null;
    }

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

    const { selectAmount } = this.state;
    const user = this.context;
    const { cartItems } = user;

    const copiedCartItems = JSON.parse(JSON.stringify(cartItems));
    if (Object.keys(copiedCartItems).indexOf(dish.dishId.toString()) !== -1) {
      copiedCartItems[dish.dishId] += selectAmount;
    } else {
      copiedCartItems[dish.dishId] = selectAmount;
    }

    let alertElement = null;

    function handleAddToCart(e) {
      e.preventDefault();
      user.updateCartItems(copiedCartItems);
      alertElement = Alert.success(`Successfully add ${selectAmount} of ${dish.name} to your cart!`, 4000);
    }

    return (
      <div className="container">
        <div className="row mt-4">
          <div className="col-12 col-lg-6">
            <Card>
              <Card.Img width="100%" src={dish.image} alt={dish.name} />
              <Card.Body>
                <Card.Text style={{ fontSize: '18px' }}>
                  {dish.description}
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="col-12 col-lg-4">
            <div className="row">
              <div className="col-11">
                <h3>{dish.name}</h3>
                <h5>{`$${dish.price}`}</h5>
              </div>
              <div className="col-1">
                <LinkContainer exact to="/menu">
                  <Button size="md" variant="light">BACK</Button>
                </LinkContainer>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-7">
                <InputNumber
                  value={selectAmount}
                  min={1}
                  max={stock}
                  onChange={this.handleInputAmountChange}
                  step={1}
                />
              </div>
              <div className="col-5">
                <Button
                  size="md"
                  variant="light"
                  disabled={stock <= 0}
                  onClick={handleAddToCart}
                >
                  ADD TO CART
                </Button>
              </div>
              {alertElement}
            </div>
          </div>
        </div>
        <hr />
        <div className="col-12 col-lg-6">
          <React.Fragment>
            <CommentList comments={comments} />
            <Pagination>
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
        <div className="col-12 col-lg-8 mt-5 mb-5">
          <AddComment
            handleAddComment={this.handleAddComment}
            distId={dish.dishId}
          />
        </div>
      </div>
    );
  }
}

OrderDish.contextType = UserContext;
const OrderDishWithToast = withToast(OrderDish);
OrderDishWithToast.fetchData = OrderDish.fetchData;

export default OrderDishWithToast;
