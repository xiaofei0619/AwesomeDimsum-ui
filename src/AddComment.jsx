import React from 'react';
import {
  Button, Form, Col, Row,
} from 'react-bootstrap';
import { Rate } from 'rsuite';

export default class AddComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 1,
      comment: '',
      author: '',
      touched: {
        comment: false,
        author: false,
      },
    };
    this.handleBlur = this.handleBlur.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRatingChange = this.handleRatingChange.bind(this);
    // this.addComment = this.addComment.bind(this);
  }

  handleInputChange(event) {
    const { target } = event;
    const { value } = target;
    const { name } = target;
    this.setState({
      [name]: value,
    });
  }

  handleRatingChange(selectRate) {
    this.setState({
      rating: selectRate,
    });
  }

  // handleBlur = (field) => (evt) => {
  //   this.setState(state => ({
  //     touched: {
  //       ...state.touched,
  //       [field]: true,
  //     },
  //   }));
  // }

  handleBlur(evt) {
    const { target } = evt;
    const { name } = target;
    this.setState(state => ({
      touched: {
        ...state.touched,
        [name]: true,
      },
    }));
  }

  validate(comment, author) {
    const errors = {
      comment: '',
      author: '',
    };

    // eslint-disable-next-line react/destructuring-assignment
    if (!this.state.touched.author) {
      errors.author = 'Nickname can not be blank';
    }

    // eslint-disable-next-line react/destructuring-assignment
    if (!this.state.touched.comment) {
      errors.comment = 'Nickname can not be blank';
    }

    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.touched.author && author.length < 3) {
      errors.author = 'Nicname should be at least 3 characters';
    // eslint-disable-next-line react/destructuring-assignment
    } else if (this.state.touched.author && author.length > 20) {
      errors.author = 'Nicname should be no longer than 20 characters';
    }

    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.touched.comment && comment.length < 6) {
      errors.comment = 'Comment should be at least 5 characters';
    }
    return errors;
  }

  render() {
    const { rating, comment, author } = this.state;
    const errors = this.validate(comment, author);

    const { handleAddComment } = this.props;
    const newComment = {};
    // eslint-disable-next-line react/destructuring-assignment
    newComment.dishId = this.props.distId;
    newComment.rating = rating;
    newComment.comment = comment;
    newComment.author = author;

    const addComment = (e) => {
      e.preventDefault();
      handleAddComment(newComment);
      this.setState({
        rating: 1,
        comment: '',
        author: '',
        touched: {
          comment: false,
          author: false,
        },
      });
    };

    return (
      <div className="container">
        <div className="row row-content">
          <div className="col-8">
            <h4>Add Your Review</h4>
          </div>
          <div className="col-12 col-md-9">
            <Form>
              <Form.Group as={Row}>
                <Form.Label htmlFor="rating" column md={2}>Rating</Form.Label>
                <Col md={10}>
                  <Rate
                    value={rating}
                    size="md"
                    onChange={this.handleRatingChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label htmlFor="author" column md={2}>NickName</Form.Label>
                <Col md={10}>
                  <Form.Control
                    type="text"
                    id="author"
                    name="author"
                    placeholder="NickName"
                    value={author}
                    isValid={errors.author === ''}
                    isInvalid={errors.author !== ''}
                    onBlur={this.handleBlur}
                    onChange={this.handleInputChange}
                  />
                  <Form.Control.Feedback type="invalid">{errors.author}</Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} style={{ marginBottom: '7px' }}>
                <Form.Label htmlFor="comment" column md={2}>Your Review</Form.Label>
                <Col md={10}>
                  <Form.Control
                    as="textarea"
                    id="comment"
                    name="comment"
                    rows={6}
                    value={comment}
                    isValid={errors.comment === ''}
                    isInvalid={errors.comment !== ''}
                    onBlur={this.handleBlur}
                    onChange={this.handleInputChange}
                  />
                </Col>
              </Form.Group>
              <Col md={{ size: 10, offset: 2 }}>
                <Button
                  type="submit"
                  variant="light"
                  disabled={errors.author !== '' || errors.comment !== ''}
                  onClick={addComment}
                >
                  ADD REVIEW
                </Button>
              </Col>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
