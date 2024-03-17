import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { Link } from 'react-router-dom';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import BrandFilter from '../components/BrandFilter';
import React, { useState } from 'react';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  const [selectedBrand, setSelectedBrand] = useState('');

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
  };

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to='/' className='btn btn-light mb-4'>
          Back
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta />
          <h1 style={{ color: 'black' }}>
            <b>Sản phẩm</b>
          </h1>
          <BrandFilter
            selectedBrand={selectedBrand}
            onBrandClick={handleBrandClick}
          />
          <Row>
            {data.products
              .filter((product) => {
                
                return !selectedBrand || product.brand === selectedBrand;
              })
              .map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;