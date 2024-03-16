import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();

  // FIX: uncontrolled input - urlKeyword may be undefined
  const [keyword, setKeyword] = useState(urlKeyword || '');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword('');
    } else {
      navigate('/');
    }
  };

  return (
    <Form onSubmit={submitHandler} style={{ display: 'flex', alignItems: 'center' }}>
      <Form.Control
        type='text'
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder='Search Products...'
        style={{ marginRight: '10px', padding: '8px', border: '2px solid #422800', borderRadius: '30px' }}
      />
      <Button
        type='submit'
        className="button-74"
        style={{
          backgroundColor: '#fbeee0',
          border: '2px solid #422800',
          borderRadius: '30px',
          boxShadow: '#422800 4px 4px 0 0',
          color: '#422800',
          cursor: 'pointer',
          display: 'inline-block',
          fontWeight: '600',
          fontSize: '18px',
          padding: '0 18px',
          lineHeight: '50px',
          textAlign: 'center',
          textDecoration: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          touchAction: 'manipulation',
        }}
      >
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
