import React from 'react';
import { Row, Col } from 'react-bootstrap';

const BrandFilter = ({ selectedBrand, onBrandClick }) => {
  return (
    <Row className='mb-4' style={{ color: 'black' }}>
      <Col>
        <h5> các loại quần áo   </h5>
        <ul className='list-inline'>
          <li className='list-inline-item'>
            <button
              type='button'
              className={`btn btn-outline-primary ${
                selectedBrand === '' ? 'active' : ''
              }`}
              onClick={() => onBrandClick('')}
            >
              Tất cả
            </button>
          </li>
          <li className='list-inline-item'>
            <button
              type='button'
              className={`btn btn-outline-primary ${
                selectedBrand === 'áo' ? 'active' : ''
              }`}
              onClick={() => onBrandClick('áo')}
            >
              các kiểu áo 
            </button>
          </li>
          <li className='list-inline-item'>
            <button
              type='button'
              className={`btn btn-outline-primary ${
                selectedBrand === 'quần' ? 'active' : ''
              }`}
              onClick={() => onBrandClick('quần')}
            >
             các kiểu quần
            </button>
          </li>
         
         
        </ul>
      </Col>
    </Row>
  );
};

export default BrandFilter;
