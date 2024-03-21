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
  const [description, setDescription] = useState('');
  const [sizeQuantities, setSizeQuantities] = useState([
    { sizeName: 'S', countInStock: '' },
    { sizeName: 'M', countInStock: '' },
    { sizeName: 'L', countInStock: '' },
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

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  };

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await createProduct({
        name: name,
        price: price,
        image: image,
        description: description,
        brand: brand,
        size: sizeQuantities,
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
      Quay lại
      </Link>
      <FormContainer>
        <h1>Tạo sản phẩm mới</h1>
        {/* {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error.data.message}</Message>
        ) : ( */}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Tên</Form.Label>
            <Form.Control
              type='name'
              placeholder='Nhập tên sản phẩm'
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='price'>
            <Form.Label>Giá tiền</Form.Label>
            <Form.Control
              type='number'
              placeholder='Nhập đơn giá'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='image'>
            <Form.Label>Hình ảnh</Form.Label>
            <Form.Control
              type='text'
              placeholder='Nhập đường dẫn hình ảnh sản phẩm'
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

          <Form.Group controlId='brand'>
            <Form.Label>Phân loại</Form.Label>
            <Form.Control
              as='select'
              value={brand}
              onChange={handleBrandChange}
            >
              <option value=''>--Phân loại sản phẩm--</option>
              <option value='Quần'>Quần</option>
              <option value='Áo'>Áo</option>
            </Form.Control>
          </Form.Group>

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
                  <th>Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {sizeQuantities.map((sizeQuantity, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Group controlId={`size-${index}`}>
                        <Form.Label>{sizeQuantity.sizeName}</Form.Label>
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group controlId={`countInStock-${index}`}>
                        <Form.Control
                          type='number'
                          placeholder='Nhập số lượng'
                          value={sizeQuantity.countInStock}
                          onChange={(e) =>
                            handleSizeQuantityChange(
                              index,
                              'countInStock',
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

          <Form.Group controlId='description'>
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              type='text'
              placeholder='Nhập thông tin mô tả'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary' style={{ marginTop: '1rem' }}>
            Tạo
          </Button>
        </Form>
        {/* )} */}
      </FormContainer>
    </>
  );
};

export default CreateProductScreen;
