import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return isLoading ? null : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <Carousel
      pause='hover'
      className='mb-4'
      style={{
        width: '800px',
        height: '600px',
        margin: 'auto',
        backgroundColor: '#fff',
      }}
    >
      {products.map((product) => (
        <Carousel.Item key={product._id} style={{ height: '600px' }}>
          <Link to={`/product/${product._id}`} style={{ marginLeft: '200px' }}>
            <Image
              src={product.image}
              alt={product.name}
              style={{ width: '400px', height: '600px' }}
            />
            <Carousel.Caption className='carousel-caption'>
              <h2 className='text-white text-right'>
                {product.name} ({product.price}.000đ)
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;