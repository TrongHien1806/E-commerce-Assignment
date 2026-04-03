# Backend Module Plan

Tài liệu này mô tả phạm vi công việc cho các module backend đã chốt:

- Auth
- User
- Health
- Food
- PT
- Cart
- Order
- Payment
- Tracking
- Chat/Workout
- Notification

---

## 1) Auth

### Chức năng

- Đăng ký tài khoản (`Customer`, `PT`)
- Đăng nhập bằng `email` hoặc `username`
- `remember_me` (refresh token dài hạn)
- Quên mật khẩu / đặt lại mật khẩu
- Refresh token, logout
- Khóa tạm tài khoản khi nhập sai nhiều lần

### API gợi ý

- `POST /users/register`
- `POST /users/login`
- `POST /users/logout`
- `POST /users/refresh-token`
- `POST /users/forgot-password`
- `POST /users/reset-password`
- `GET /users/check-email`
- `GET /users/check-username`

### Đầu ra mong đợi

- JWT access/refresh hoạt động ổn định
- Message lỗi/thành công thống nhất tiếng Việt
- Validate đầy đủ dữ liệu đầu vào

---

## 2) User

### Chức năng

- Quản lý hồ sơ người dùng
- Xem/cập nhật thông tin cá nhân
- Lưu role và trạng thái tài khoản

### API gợi ý

- `GET /users/me`
- `PATCH /users/me`
- `GET /users/:username`

### Đầu ra mong đợi

- Dữ liệu profile sạch, không trả field nhạy cảm
- Có kiểm tra quyền khi sửa thông tin

---

## 3) Health

### Chức năng

- Thu thập hồ sơ sức khỏe (gender, age, height, weight, activity, goal)
- Lưu dị ứng/kiêng kỵ
- Tính BMR, TDEE, target calories, macro

### API gợi ý

- `POST /health/profile`
- `PATCH /health/profile`
- `GET /health/metrics`

### Đầu ra mong đợi

- Công thức tính đúng và nhất quán
- Dữ liệu cập nhật sẽ trigger tính toán lại

---

## 4) Food

### Chức năng

- Danh sách món ăn
- Tìm kiếm, lọc, sắp xếp
- Xem chi tiết món ăn và dinh dưỡng

### API gợi ý

- `GET /foods`
- `GET /foods/:id`

### Đầu ra mong đợi

- Hỗ trợ filter kết hợp (giá, calo, vegan, ...)
- Response có pagination rõ ràng

---

## 5) PT

### Chức năng

- Danh sách PT
- Hồ sơ PT (kinh nghiệm, chuyên môn, portfolio)
- Dịch vụ/gói PT

### API gợi ý

- `GET /pts`
- `GET /pts/:id`
- `GET /pt-services`
- `GET /pt-services/:id`

### Đầu ra mong đợi

- Dữ liệu PT hiển thị đủ để khách ra quyết định
- Tách rõ PT chưa duyệt/đã duyệt ở luồng auth-admin

---

## 6) Cart

### Chức năng

- Thêm món/gói PT vào giỏ
- Tăng/giảm số lượng
- Xóa item / xóa toàn bộ giỏ
- Tính subtotal + tổng calories realtime

### API gợi ý

- `GET /cart`
- `POST /cart/items`
- `PATCH /cart/items/:item_id`
- `DELETE /cart/items/:item_id`
- `DELETE /cart`

### Đầu ra mong đợi

- Cart state chính xác theo user
- Tính tiền/calo đúng theo dữ liệu hiện tại

---

## 7) Order

### Chức năng

- Tạo đơn từ giỏ hàng
- Tính phí ship
- Lưu ghi chú giao hàng
- Theo dõi trạng thái đơn (`Pending -> Cooking -> Delivering -> Completed`)
- Cho phép hủy đơn khi còn `Pending`

### API gợi ý

- `POST /orders`
- `GET /orders`
- `GET /orders/:id`
- `PATCH /orders/:id/cancel`
- `PATCH /orders/:id/status` (admin/ops)

### Đầu ra mong đợi

- Luồng đơn hàng rõ ràng, không nhảy trạng thái sai
- Ràng buộc hủy đơn đúng nghiệp vụ

---

## 8) Payment

### Chức năng

- Tạo giao dịch thanh toán online (VNPay/MoMo)
- Nhận callback/webhook từ cổng thanh toán
- Đồng bộ trạng thái thanh toán vào đơn hàng
- Lưu lịch sử thanh toán

### API gợi ý

- `POST /payments/create-url`
- `GET /payments/callback`
- `POST /payments/webhook`
- `GET /payments/history`

### Đầu ra mong đợi

- Thanh toán thành công thì order cập nhật đúng
- Có xác thực chữ ký callback/webhook

---

## 9) Tracking

### Chức năng

- Theo dõi cân nặng theo thời gian
- Theo dõi calo tiêu thụ hằng ngày
- So sánh với mục tiêu calories

### API gợi ý

- `POST /tracking/weight`
- `GET /tracking/weight`
- `POST /tracking/calories`
- `GET /tracking/calories/today`

### Đầu ra mong đợi

- Dữ liệu time-series chuẩn theo ngày
- Có thể dùng trực tiếp cho biểu đồ frontend

---

## 10) Chat/Workout

### Chức năng

- Tạo phòng chat giữa PT và khách
- Gửi/nhận tin nhắn
- Giao bài tập theo ngày/tuần
- Đánh dấu bài tập hoàn thành

### API gợi ý

- `GET /chat/rooms`
- `POST /chat/rooms/:id/messages`
- `GET /chat/rooms/:id/messages`
- `POST /workouts/assignments`
- `PATCH /workouts/assignments/:id/complete`

### Đầu ra mong đợi

- PT chỉ xem được học viên thuộc phạm vi quản lý
- Lịch tập và trạng thái hoàn thành chính xác

---

## 11) Notification

### Chức năng

- Tạo thông báo hệ thống theo sự kiện
- Thông báo đơn hàng, chat, PT approval, ...
- Đánh dấu đã đọc/chưa đọc

### API gợi ý

- `GET /notifications`
- `PATCH /notifications/:id/read`
- `PATCH /notifications/read-all`

### Đầu ra mong đợi

- Có badge chưa đọc
- Thông báo đúng đối tượng nhận

---

## Quy tắc kỹ thuật chung cho tất cả module

- Chuẩn response thống nhất: `{ message, result }`
- Validate đầu vào ở middleware
- Không trả thông tin nhạy cảm (password/token raw)
- Viết message lỗi rõ ràng, thống nhất ngôn ngữ
- Mỗi module có route/controller/service/schema riêng

---

## Gợi ý triển khai theo thứ tự

1. Auth + User (nền tảng)
2. Health + Tracking
3. Food + PT
4. Cart + Order
5. Payment
6. Chat/Workout + Notification

Thứ tự này giúp frontend có thể tích hợp dần mà không bị chặn luồng chính.


Run srcipt
npx tsx scripts/seed-pts.ts