# Bộ dữ liệu đã khóa

Nguồn giá duy nhất: **StatMuse Money**, close đã điều chỉnh chia tách, USD hiển thị 2 chữ số. Khóa ngày 30/09/2026. Không trộn giá intraday, pre-market hay after-hours. Giá trong engine = số ở bảng × 100 (cent).

| Vòng | Event / close trước tin | Close phiên reveal | Execution USD | Reveal USD | Nguồn |
|---|---|---|---:|---:|---|
| 01 | 2017-04-17 | 2017-04-18 | 14.73 | 14.34 | https://www.statmuse.com/money/ask/netflix-market-cap-april-2017 |
| 02 | 2018-07-16 | 2018-07-17 | 40.05 | 37.95 | https://www.statmuse.com/money/ask/netflix-stock-july-2018 |
| 03 | 2019-07-17 | 2019-07-18 | 36.24 | 32.52 | https://www.statmuse.com/money/ask/netflix-stock-prices-july-2019 |
| 04 | 2020-01-21 | 2020-01-22 | 33.81 | 32.60 | https://www.statmuse.com/money/ask/netflix-stock-january-2020 |
| 05 | 2021-01-19 | 2021-01-20 | 50.18 | 58.63 | https://www.statmuse.com/money/ask/netflix-stock-price-january-2021 |
| 06 | 2021-10-19 | 2021-10-20 | 63.90 | 62.51 | https://www.statmuse.com/money/ask/price-of-netflix-stock-oct-2021 |
| 07 | 2022-04-19 | 2022-04-20 | 34.86 | 22.62 | https://www.statmuse.com/money/ask/netflix-stock-price-april-2022 |
| 08 | 2022-10-18 | 2022-10-19 | 24.09 | 27.24 | https://www.statmuse.com/money/ask/netflix-stock-price-october-2022 |
| 09 | 2024-01-23 | 2024-01-24 | 49.22 | 54.49 | https://www.statmuse.com/money/ask/netflix-stock-price-jan-2024 |

CPI-U U.S. city average, all items, not seasonally adjusted, 1982–84=100:
https://www.bls.gov/regions/mid-atlantic/data/consumerpriceindexhistorical_us_table.htm

04/2017 = 244.524; 01/2024 = 308.417.

## Nội dung sự kiện

Bản 2.0 dùng 9 tình huống trong tài liệu `questions+chart game.docx` của người dùng. Kho báo cáo gốc để thuyết trình / kiểm tra lại: https://ir.netflix.net/financials/quarterly-earnings/default.aspx

Các tài liệu bổ sung đã tra cứu:
- Netflix Q1 2017 investor event: https://ir.netflix.net/investor-news-and-events/investor-events/event-details/2017/Netflix-First-Quarter-2017-Earnings-Interview/default.aspx
- Q1 2017 4.95m additions coverage: https://www.forbes.com/sites/maddieberg/2017/04/17/netflix-q1-gains-fall-short-of-expectations/
- Q2 2019 letter: https://www.netflixinvestor.com/files/doc_financials/quarterly_reports/2019/q2/Q2-19-Shareholder-Letter-FINAL.pdf
- Q1 2022 shareholder letter filed at SEC: https://www.sec.gov/Archives/edgar/data/1065280/000106528022000144/ex991_q122.htm
- Q4 2023 shareholder letter: https://ir.netflix.net/files/doc_financials/2023/q4/NEW-FINAL-Q4-23-Shareholder-Letter.pdf

Đoạn giải thích mỗi reveal là gợi ý thảo luận, không phải bằng chứng nhân quả rằng duy nhất một tin gây ra toàn bộ biến động phiên. Không tạo đáp án BUY/HOLD/SELL tuyệt đối. Quyết định còn phụ thuộc cash và shares đang có.

## Chart bản 2.0

Chart được vẽ lại từ giá đóng cửa cùng provider và cùng thang giá A. Mỗi vòng có **10 phiên đến ngày sự kiện + 1 phiên kết quả**, tổng cộng 99 điểm. Không nối bằng đường giả định và không dùng dữ liệu mô phỏng làm giá lịch sử. Trước thời hạn, server chỉ trả 10 điểm đầu; sau thời hạn mới trả điểm thứ 11. Giới hạn trục cũng chỉ được tính từ các điểm đang được phép xem.

Nội dung tài liệu được giữ ý chính. Các chỉnh sửa có chủ đích:

- Tài liệu có một số mốc giá/ngày không khớp: 20/01/2021, 19–20/04/2022 và 17–18/10/2022. Bản này dùng chuỗi giá đối chiếu từ các nguồn tháng ở bảng trên.
- Câu 7 dùng dự báo công ty **+2,5 triệu** thuê bao (thực tế −0,2 triệu), doanh thu **7,868 tỷ USD**, làm tròn nhãn 7,87 tỷ. Nguồn: thư cổ đông Q1/2022 nộp SEC ở trên.
- Câu 7 chỉ mô tả giảm giá trước báo cáo, không nói trước kết quả của phiên sau.
- Giá xấp xỉ 1/10 giá danh nghĩa trong chart cũ do cùng sử dụng giá điều chỉnh chia tách; các cổ phiếu ban đầu cũng trên thang này. Không nhân riêng một vòng.

Netflix công bố chia tách 10:1 năm 2025: https://ir.netflix.net/investor-news-and-events/financial-releases/press-release-details/2025/Netflix-Announces-Ten-For-One-Stock-Split/default.aspx

Số liệu bên dưới là bản dễ đọc của `lib/price-history.json`; đơn vị USD. File JSON dùng cent nguyên.

### Vòng 01 · 2017-04-17

Nguồn: https://www.statmuse.com/money/ask/netflix-market-cap-april-2017

| Ngày | Close USD | Mốc |
|---|---:|---|
| 2017-04-03 | 14.69 | Lịch sử |
| 2017-04-04 | 14.55 | Lịch sử |
| 2017-04-05 | 14.36 | Lịch sử |
| 2017-04-06 | 14.37 | Lịch sử |
| 2017-04-07 | 14.31 | Lịch sử |
| 2017-04-10 | 14.39 | Lịch sử |
| 2017-04-11 | 14.44 | Lịch sử |
| 2017-04-12 | 14.38 | Lịch sử |
| 2017-04-13 | 14.29 | Lịch sử |
| 2017-04-17 | 14.73 | Quyết định |
| 2017-04-18 | 14.34 | Kết quả (ẩn trước deadline) |

### Vòng 02 · 2018-07-16

Nguồn: https://www.statmuse.com/money/ask/netflix-stock-july-2018

| Ngày | Close USD | Mốc |
|---|---:|---|
| 2018-07-02 | 39.82 | Lịch sử |
| 2018-07-03 | 39.05 | Lịch sử |
| 2018-07-05 | 39.84 | Lịch sử |
| 2018-07-06 | 40.83 | Lịch sử |
| 2018-07-09 | 41.90 | Lịch sử |
| 2018-07-10 | 41.56 | Lịch sử |
| 2018-07-11 | 41.87 | Lịch sử |
| 2018-07-12 | 41.35 | Lịch sử |
| 2018-07-13 | 39.58 | Lịch sử |
| 2018-07-16 | 40.05 | Quyết định |
| 2018-07-17 | 37.95 | Kết quả (ẩn trước deadline) |

### Vòng 03 · 2019-07-17

Nguồn: https://www.statmuse.com/money/ask/netflix-stock-prices-july-2019

| Ngày | Close USD | Mốc |
|---|---:|---|
| 2019-07-03 | 38.17 | Lịch sử |
| 2019-07-05 | 38.06 | Lịch sử |
| 2019-07-08 | 37.62 | Lịch sử |
| 2019-07-09 | 37.99 | Lịch sử |
| 2019-07-10 | 38.10 | Lịch sử |
| 2019-07-11 | 37.95 | Lịch sử |
| 2019-07-12 | 37.33 | Lịch sử |
| 2019-07-15 | 36.66 | Lịch sử |
| 2019-07-16 | 36.60 | Lịch sử |
| 2019-07-17 | 36.24 | Quyết định |
| 2019-07-18 | 32.52 | Kết quả (ẩn trước deadline) |

### Vòng 04 · 2020-01-21

Nguồn: https://www.statmuse.com/money/ask/netflix-stock-january-2020

| Ngày | Close USD | Mốc |
|---|---:|---|
| 2020-01-07 | 33.08 | Lịch sử |
| 2020-01-08 | 33.93 | Lịch sử |
| 2020-01-09 | 33.57 | Lịch sử |
| 2020-01-10 | 32.91 | Lịch sử |
| 2020-01-13 | 33.89 | Lịch sử |
| 2020-01-14 | 33.87 | Lịch sử |
| 2020-01-15 | 33.91 | Lịch sử |
| 2020-01-16 | 33.86 | Lịch sử |
| 2020-01-17 | 33.97 | Lịch sử |
| 2020-01-21 | 33.81 | Quyết định |
| 2020-01-22 | 32.60 | Kết quả (ẩn trước deadline) |

### Vòng 05 · 2021-01-19

Nguồn: https://www.statmuse.com/money/ask/netflix-stock-price-january-2021

| Ngày | Close USD | Mốc |
|---|---:|---|
| 2021-01-05 | 52.08 | Lịch sử |
| 2021-01-06 | 50.05 | Lịch sử |
| 2021-01-07 | 50.89 | Lịch sử |
| 2021-01-08 | 51.04 | Lịch sử |
| 2021-01-11 | 49.91 | Lịch sử |
| 2021-01-12 | 49.43 | Lịch sử |
| 2021-01-13 | 50.78 | Lịch sử |
| 2021-01-14 | 50.09 | Lịch sử |
| 2021-01-15 | 49.80 | Lịch sử |
| 2021-01-19 | 50.18 | Quyết định |
| 2021-01-20 | 58.63 | Kết quả (ẩn trước deadline) |

### Vòng 06 · 2021-10-19

Nguồn: https://www.statmuse.com/money/ask/price-of-netflix-stock-oct-2021

| Ngày | Close USD | Mốc |
|---|---:|---|
| 2021-10-06 | 63.91 | Lịch sử |
| 2021-10-07 | 63.19 | Lịch sử |
| 2021-10-08 | 63.27 | Lịch sử |
| 2021-10-11 | 62.70 | Lịch sử |
| 2021-10-12 | 62.49 | Lịch sử |
| 2021-10-13 | 62.98 | Lịch sử |
| 2021-10-14 | 63.38 | Lịch sử |
| 2021-10-15 | 62.83 | Lịch sử |
| 2021-10-18 | 63.80 | Lịch sử |
| 2021-10-19 | 63.90 | Quyết định |
| 2021-10-20 | 62.51 | Kết quả (ẩn trước deadline) |

### Vòng 07 · 2022-04-19

Nguồn: https://www.statmuse.com/money/ask/netflix-stock-price-april-2022

| Ngày | Close USD | Mốc |
|---|---:|---|
| 2022-04-05 | 38.02 | Lịch sử |
| 2022-04-06 | 36.84 | Lịch sử |
| 2022-04-07 | 36.22 | Lịch sử |
| 2022-04-08 | 35.59 | Lịch sử |
| 2022-04-11 | 34.80 | Lịch sử |
| 2022-04-12 | 34.41 | Lịch sử |
| 2022-04-13 | 35.04 | Lịch sử |
| 2022-04-14 | 34.11 | Lịch sử |
| 2022-04-18 | 33.79 | Lịch sử |
| 2022-04-19 | 34.86 | Quyết định |
| 2022-04-20 | 22.62 | Kết quả (ẩn trước deadline) |

### Vòng 08 · 2022-10-18

Nguồn: https://www.statmuse.com/money/ask/netflix-stock-price-october-2022

| Ngày | Close USD | Mốc |
|---|---:|---|
| 2022-10-05 | 23.67 | Lịch sử |
| 2022-10-06 | 24.00 | Lịch sử |
| 2022-10-07 | 22.48 | Lịch sử |
| 2022-10-10 | 23.00 | Lịch sử |
| 2022-10-11 | 21.43 | Lịch sử |
| 2022-10-12 | 22.09 | Lịch sử |
| 2022-10-13 | 23.25 | Lịch sử |
| 2022-10-14 | 23.00 | Lịch sử |
| 2022-10-17 | 24.51 | Lịch sử |
| 2022-10-18 | 24.09 | Quyết định |
| 2022-10-19 | 27.24 | Kết quả (ẩn trước deadline) |

### Vòng 09 · 2024-01-23

Nguồn: https://www.statmuse.com/money/ask/netflix-stock-price-jan-2024

| Ngày | Close USD | Mốc |
|---|---:|---|
| 2024-01-09 | 48.21 | Lịch sử |
| 2024-01-10 | 47.83 | Lịch sử |
| 2024-01-11 | 49.22 | Lịch sử |
| 2024-01-12 | 49.22 | Lịch sử |
| 2024-01-16 | 48.12 | Lịch sử |
| 2024-01-17 | 48.03 | Lịch sử |
| 2024-01-18 | 48.53 | Lịch sử |
| 2024-01-19 | 48.30 | Lịch sử |
| 2024-01-22 | 48.57 | Lịch sử |
| 2024-01-23 | 49.22 | Quyết định |
| 2024-01-24 | 54.49 | Kết quả (ẩn trước deadline) |
