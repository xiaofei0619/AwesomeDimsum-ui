import React from 'react';
import { Carousel } from 'react-bootstrap';

function Home() {
  const carouselStyle = {
    maxWidth: '100%',
  };
  const carouselImgStyle = {
    width: '100%',
    height: '748px',
  };
  const carouselCaptionStyle = {
    top: '50%',
    transform: 'translateY(-50%)',
    bottom: 'initial',
    fontSize: '30px',
  };

  return (
    <Carousel fade>
      <Carousel.Item style={carouselStyle}>
        <img
          className="CarouselImg"
          src="/image/home1.jpeg"
          alt="FirstSlide"
          style={carouselImgStyle}
        />
        <Carousel.Caption style={carouselCaptionStyle}>
          <h1>Welcome to AweSome DimSum</h1>
          <hr />
          <p>Online Order 15% Off over $60 before Tax!</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item style={carouselStyle}>
        <img
          className="CarouselImg"
          src="/image/home2.jpeg"
          alt="SecondSlide"
          style={carouselImgStyle}
        />
        <Carousel.Caption style={carouselCaptionStyle}>
          <h1>Traditional Handmade DimSum</h1>
          <hr />
          <p>We Have the Most Experienced Dimsum Chefs from China</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item style={carouselStyle}>
        <img
          className="CarouselImg"
          src="/image/home3.jpeg"
          alt="ThirdSlide"
          style={carouselImgStyle}
        />
        <Carousel.Caption style={carouselCaptionStyle}>
          <h1>Yum Cha 飲 茶</h1>
          <hr />
          <p>
            Yum cha also known as going for dim sum, is the Cantonese tradition of brunch
            involving Chinese tea and dim sum.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default Home;
