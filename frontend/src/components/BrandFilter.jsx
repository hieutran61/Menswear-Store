import React from 'react';
import { Row, Col } from 'react-bootstrap';

const BrandFilter = ({ selectedBrand, onBrandClick }) => {
  return (
    <Row className='mb-4' style={{ color: 'black' }}>
      <Col>
        <h5> Các loại quần áo   </h5>
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
                selectedBrand === 'Áo' ? 'active' : ''
              }`}
              onClick={() => onBrandClick('Áo')}
            >
              Các kiểu áo 
            </button>
          </li>
          <li className='list-inline-item'>
            <button
              type='button'
              className={`btn btn-outline-primary ${
                selectedBrand === 'Quần' ? 'active' : ''
              }`}
              onClick={() => onBrandClick('Quần')}
            >
             Các kiểu quần
            </button>
          </li>
         
         
        </ul>
      </Col>
    </Row>
  );
};

export default BrandFilter;
