import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from '../slices/productsApiSlice';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { addToCart } from '../slices/cartSlice';
import { useAddItemToCartMutation } from '../slices/cartsApiSlice';

const ProductScreen = () => {
  const { id: productId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [size, setSize] = useState('S');
  const [comment, setComment] = useState('');

  const [addItemToCart] = useAddItemToCartMutation();

  const addToCartHandler = async () => {
    console.log("add item to cart, quantity: ", qty);
    try {
      const res = await addItemToCart({
        product: product._id,
        quantity: qty,
        size: size,
        itemPrice: product.price * qty,
      }).unwrap();
      navigate('/cart');
    } catch (err) {
      console.log("err");
      toast.error(err);
    }
  };

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const handleSizeChange = (e) => {
    setSize(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success('Review created successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
       Quay lại
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta title={product.name} description={product.description} />
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} đánh giá`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Giá: {product.price} VND</ListGroup.Item>
                <ListGroup.Item>
                  Mô tả: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Giá:</Col>
                      <Col>
                        <strong>{product.price} VND</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Trạng thái:</Col>
                      <Col>
                      {product.size.find((sizeOption) => sizeOption.sizeName === size)?.countInStock > 0
                      ? 'Còn hàng'
                      : 'Hết hàng'}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Size:</Col>
                      <Col>
                        <Form.Control
                          as='select'
                          value={size}
                          onChange={handleSizeChange}
                          style={{
                            borderRadius: '5px',
                            border: '1px solid #b5c0c1',
                            color: 'var(--bs-body-color)',
                          }}
                        >
                          {/* Lặp qua mảng size để hiển thị danh sách kích thước */}
                          {product.size.map((sizeOption) => (
                            <option key={sizeOption.sizeName} value={sizeOption.sizeName}>
                              {sizeOption.sizeName}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {/* Qty Select */}
                  {size && product.size.find((sizeOption) => sizeOption.sizeName === size)?.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Số lượng</Col>
                        <Col>
                          <Form.Control
                            as='select'
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                          >
                            {[...Array(product.size.find((sizeOption) => sizeOption.sizeName === size).countInStock
                              ).keys()].map((x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      className='btn-block'
                      type='button'
                      disabled={size && product.size.find((sizeOption) => sizeOption.sizeName === size)?.countInStock <= 0}
                      onClick={addToCartHandler}
                    >
                      Thêm vào giỏ
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className='review'>
            <Col md={6}>
              <h2>Đánh giá</h2>
              {product.reviews.length === 0 && <Message>0 đánh giá</Message>}
              <ListGroup variant='flush'>
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Hãy viết đánh giá của bạn</h2>

                  {loadingProductReview && <Loader />}

                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group className='my-2' controlId='rating'>
                        <Form.Label>Chấm điểm</Form.Label>
                        <Form.Control
                          as='select'
                          required
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value=''>Lựa chọn...</option>
                          <option value='1'>1 - Rất xấu</option>
                          <option value='2'>2 - Xấu</option>
                          <option value='3'>3 - Bình thường</option>
                          <option value='4'>4 - Đẹp</option>
                          <option value='5'>5 - Rất đẹp</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group className='my-2' controlId='comment'>
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control
                          as='textarea'
                          row='3'
                          required
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={loadingProductReview}
                        type='submit'
                        variant='primary'
                      >
                        Gửi
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Vui lòng <Link to='/login'>đăng nhập</Link> để viết đánh giá
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
