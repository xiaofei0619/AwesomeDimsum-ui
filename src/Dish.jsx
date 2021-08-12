import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default function Dish({ dish }) {
  const marginStyle = {
    marginBottom: '7px',
  };
  if (dish.stock <= 0) {
    const ButtonStyle = {
      position: 'relative',
    };
    return (
      <Card className="text-center" style={marginStyle}>
        <Card.Img width="100%" src={dish.image} alt={dish.name} />
        <Card.ImgOverlay>
          <Card.Title><mark><b>SOLD OUT</b></mark></Card.Title>
        </Card.ImgOverlay>
        <Card.Body>
          <Card.Subtitle>{dish.name}</Card.Subtitle>
          <Card.Text>{`$${dish.price}`}</Card.Text>
        </Card.Body>
        <Card.Footer style={ButtonStyle}>
          <LinkContainer exact to={`/order/${dish.dishId}`}>
            <Button size="sm" variant="light">TAKE A LOOK</Button>
          </LinkContainer>
        </Card.Footer>
      </Card>
    );
  }
  return (
    <Card className="text-center" style={marginStyle}>
      <Card.Img width="100%" src={dish.image} alt={dish.name} />
      <Card.Body>
        <Card.Subtitle>{dish.name}</Card.Subtitle>
        <Card.Text>{`$${dish.price}`}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <LinkContainer exact to={`/order/${dish.dishId}`}>
          <Button size="sm" variant="light">ADD TO CART</Button>
        </LinkContainer>
      </Card.Footer>
    </Card>
  );
}
