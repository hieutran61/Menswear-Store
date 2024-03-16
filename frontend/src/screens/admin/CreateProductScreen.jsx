import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Table } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';

const CreateProductScreen = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [sizeQuantities, setSizeQuantities] = useState([
    { size: 'S', quantity: '' },
    { size: 'M', quantity: '' },
    { size: 'L', quantity: '' },
  ]); // Mảng lưu trữ thông tin về size và số lượng

  const handleSizeQuantityChange = (index, field, value) => {
    // Cập nhật thông tin về size và số lượng trong mảng
    const updatedSizeQuantities = [...sizeQuantities];
    updatedSizeQuantities[index][field] = value;
    setSizeQuantities(updatedSizeQuantities);
  };

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [createProduct, { isLoading: loadingUpdate }] =
    useCreateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await createProduct({
        // productId,
        name: name,
        price: price,
        image: image,
        description: description,
        countInStock: countInStock,
        sizeQuantities: sizeQuantities
      }).unwrap();
      // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
      toast.success('Product Created');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
      setSizeQuantities(product.sizeQuantities);
    }
  }, [product]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Create Product</h1>
        {/* {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error.data.message}</Message>
        ) : ( */}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='name'
              placeholder='Enter name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='price'>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type='number'
              placeholder='Enter price'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='image'>
            <Form.Label>Image</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter image url'
              value={image}
              onChange={(e) => setImage(e.target.value)}
            ></Form.Control>
            <Form.Control
              label='Choose File'
              onChange={uploadFileHandler}
              type='file'
            ></Form.Control>
            {loadingUpload && <Loader />}
          </Form.Group>

          {/* <Form.Group controlId='brand'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter brand'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group> */}

          <div
            className='table-responsive'
            style={{
              borderRadius: '10px',
              border: '1px solid #b5c0c1',
              margin: '20px 0',
            }}
          >
            <Table
              striped
              bordered
              hover
              style={{ marginTop: '20px', borderRadius: '10px' }}
            >
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {sizeQuantities.map((sizeQuantity, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Group controlId={`size-${index}`}>
                        <Form.Label>{sizeQuantity.size}</Form.Label>
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group controlId={`quantity-${index}`}>
                        <Form.Control
                          type='number'
                          placeholder='Enter quantity'
                          value={sizeQuantity.quantity}
                          onChange={(e) =>
                            handleSizeQuantityChange(
                              index,
                              'quantity',
                              e.target.value
                            )
                          }
                        ></Form.Control>
                      </Form.Group>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* <Form.Group controlId='countInStock'>
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              type='number'
              placeholder='Enter countInStock'
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
            ></Form.Control>
          </Form.Group> */}

          {/* <Form.Group controlId='category'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group> */}

          <Form.Group controlId='description'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary' style={{ marginTop: '1rem' }}>
            Create
          </Button>
        </Form>
        {/* )} */}
      </FormContainer>
    </>
  );
};

export default CreateProductScreen;
