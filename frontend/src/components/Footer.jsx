import { Container, Row, Col } from 'react-bootstrap';
import facebookLogo from '../assets/OIP (2).jpg';
import instagramLogo from '../assets/OIP (3).jpg';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: 'wheat', fontFamily: 'cursive', color: '#000' }}>
      <Container>
        <Row className='text-center py-3'>
          <Col>
            <p>Menwear Store &copy; {currentYear}</p>
            <div>
              <a href="https://www.facebook.com/yourFacebookPage" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', marginRight: '10px' }}>
                <img src={facebookLogo} alt="Facebook" style={{ width: '30px', height: '30px' }} />
              </a>
              <a href="https://www.instagram.com/retro.decorr/" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>
                <img src={instagramLogo} alt="Instagram" style={{ width: '30px', height: '30px' }} />
              </a>
            </div>
            <p style={{ color:'#000', marginBottom: '5px' }}>"Menwear Store nơi định hình phong cách của bạn."</p>
            <p style={{ color:'#000', marginBottom: '5px' }}>Phương thức thanh toán: COD, chuyển khoản ngân hàng</p>
            <p style={{ color:'#000', marginBottom: '5px' }}>Địa chỉ: FPT University</p>
            <p style={{ color:'#000', marginBottom: '5px' }}>Số điện thoại: 0919737083</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
