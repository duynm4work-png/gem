# Bản 2.0 · Kết quả kiểm chứng

Các kiểm tra dưới đây dùng Node.js 24.19.0, Next.js 16.2.11, React 19.2.4. Bộ giá khóa ngày 30/09/2026.

| Kiểm tra | Kết quả |
|---|---|
| `npm test` | PASS, 14/14 bài engine và SQLite |
| `npm run test:room` | PASS, 50 người × 9 vòng, 450 lệnh qua API handler |
| `npm run build` | PASS, build production webpack |
| Trình duyệt trên server production local | PASS, Chromium 153.0.8010.0, host + 2 người chơi và 1 người tự HOLD |
| Chơi một mình | PASS: tạo phòng, bắt đầu, xác nhận HOLD |
| Thời hạn thực | PASS: vòng đầu chờ đủ 60 giây, không chốt sớm dù đã có lệnh |
| Lệnh một phần | BUY 123 CP và SELL 321 CP: tiền/cổ đúng đến cent, phần còn lại được giữ |
| Reload cùng tab | Giữ người chơi, lệnh và số lượng đã xác nhận |
| Trước / sau công bố | 10 / 11 điểm chart; giá tương lai và lệnh người khác không có trong state trước hạn |
| Nhập số cổ | Chặn 0 và vượt khả năng; nút 25%, +/− và xem trước danh mục hoạt động |
| 9 màn hình sự kiện | Đi qua cả 9 vòng, đến tổng kết và tải nhật ký JSON đủ 9 dòng |
| Replay quản trò | Chuyển xem lịch sử từng người được |
| Layout sau sửa | Không tràn trang ở 320, 390, 768, 1024, 1440 px; bảng rộng cuộn trong khung |
| Font | Chromium xác nhận tiêu đề dùng font Noto Sans đóng gói; tiếng Việt không rơi về font hệ thống |
| Chart | Bấm điểm giá cập nhật số đọc; bảng dữ liệu trước hạn có đúng 10 dòng |
| Chuyển động | Tắt animation khi thiết bị đặt `prefers-reduced-motion: reduce` |
| Lỗi JavaScript trong lượt kiểm tra trình duyệt | 0 |
| Bundle client | Không chứa tiêu đề sự kiện tương lai hoặc ngày reveal của 9 vòng |

## Phạm vi và cách hiểu

- 14 bài kiểm thử bao gồm phép tính BUY/SELL/HOLD, 500 giao dịch đối chiếu bảo toàn tài sản ở giá khớp, hạn 60.000 ms, thời điểm ngay trước/đúng hạn, lệnh bất biến, xác thực, phòng 50 người, 9 vòng đối chiếu phép tính số nguyên độc lập, xếp hạng, đồng hạng, bảo toàn luật phòng cũ và ghi đồng thời bằng CAS.
- Mô phỏng 50 người chạy qua **API handler với đồng hồ kiểm thử**, không phải 50 thiết bị thật hoặc kiểm thử tải trên internet.
- Lượt trình duyệt chạy server Next.js production thật tại localhost. **Vòng 1 dùng 60 giây thực**. Để kiểm tra các màn hình còn lại, 8 vòng tiếp theo được đẩy deadline trong database QA riêng. Mã nguồn giao cho người dùng không có nút, endpoint hay chế độ rút ngắn deadline này.
- Đã xem ảnh lobby, chọn lệnh desktop/mobile, chart, kết quả, câu dài vòng 5 và tổng kết. Kiểm tra kích thước dùng cả chiều rộng viewport thực và chiều rộng trang để phát hiện trường hợp điện thoại tự thu nhỏ trang.
- Phát hiện và sửa: trang tổng kết tràn ngang trên điện thoại; nút luật chơi thiếu tên truy cập khi ẩn chữ; modal bị lấy lại focus do bộ đếm render; nút tổng kết xuống dòng quá nhiều ở 320 px.
- Supabase, Ably và Vercel **chưa kiểm thử với tài khoản/credentials thật** trong lượt này. Việc deploy được để sau theo yêu cầu.
- Windows `.bat` đã soát lệnh và dùng CRLF; chưa chạy trên máy Windows thật. Trên môi trường bàn giao, game chạy bằng các lệnh npm tương đương.

## Chạy lại

```bash
npm test
npm run test:room
npm run build
npm start
```

Test phòng dùng SQLite tạm rồi xóa. Các báo lỗi cố ý như “Phòng đã đủ 50 người”, “Lệnh đã xác nhận” xuất hiện trong test là các tình huống từ chối được mong đợi; kết quả cuối phải là `PASS`.
