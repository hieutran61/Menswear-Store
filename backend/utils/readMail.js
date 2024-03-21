import Imap from 'imap-simple';
import iconv from 'iconv-lite';

const readMail = async () => {
  // Tùy chọn TLS để bỏ qua việc xác thực chứng chỉ
  const tlsOptions = {
    rejectUnauthorized: false,
  };

  // Thông tin tài khoản Gmail
  const config = {
    imap: {
      user: 'hieutran6102@gmail.com',
      password: 'pmrj pbdo sglc epin',
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions, // Sử dụng tùy chọn TLS ở đây
      authTimeout: 3000,
    },
  };

  var amount = null;

  try {
    // Kết nối đến Gmail
    const connection = await Imap.connect(config);

    // Mở hộp thư inbox
    await connection.openBox('INBOX');

    // Lọc email chưa đọc từ support@timo.vn với chủ đề "Thông báo thay đổi số dư tài khoản"
    const searchCriteria = ['UNSEEN', ['FROM', 'support@timo.vn'], ['SUBJECT', 'Thông báo thay đổi số dư tài khoản']];

    // Lấy danh sách email chưa đọc
    const fetchOptions = { bodies: ['HEADER.FIELDS (FROM SUBJECT)', 'TEXT'], markSeen: false };
    const messages = await connection.search(searchCriteria, fetchOptions);

    // Lấy email mới nhất (chỉ lấy một email)
    const latestMessage = messages[0];

    // Lấy nội dung email dưới dạng MIME
    if (latestMessage != null) {
      const emailMimeContent = latestMessage.parts.filter(part => part.which === 'TEXT')[0].body;
      // Giải mã nội dung email từ Quoted-Printable sang UTF-8
      const decodedEmailContent = iconv.decode(Buffer.from(decodeQuotedPrintable(emailMimeContent), 'binary'), 'utf-8');

      // Tìm số nằm giữa "Spend Account vừa tăng" và "VND" trong chuỗi email
      const regex = /Spend Account vừa tăng\s+(\d+(?:[.,]\d+)?)\s+VND/g;
      const match = regex.exec(decodedEmailContent);

      
      if (match && match[1]) {
        // Lấy số tiền từ kết quả tìm được và chuyển đổi sang dạng số
        const amountStr = match[1].replace(/,/g, ''); // Loại bỏ dấu , từ chuỗi số
        amount = parseFloat(amountStr)*1000; // Chuyển đổi chuỗi số thành số dạng float

        console.log("Số tiền:", amount); // In số tiền đã chuyển đổi sang dạng số
      } else {
        console.log("Không tìm thấy số tiền trong email.");
      }
    }

    // Đóng kết nối
    await connection.end();

    return amount;
  } catch (error) {
    console.error('Error reading emails:', error);
  }
};

// Hàm giải mã Quoted-Printable
function decodeQuotedPrintable(encodedText) {
  return encodedText.replace(/=\r\n/g, '').replace(/=([0-9A-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

export default readMail;
