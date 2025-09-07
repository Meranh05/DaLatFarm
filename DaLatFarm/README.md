## Trường Đại học Đà Lạt  
### Khoa Công nghệ Thông tin  
—   —

## ĐỀ CƯƠNG THỰC HIỆN ĐỒ ÁN

### Tên đề tài
Trang Web Giới thiệu Sản phẩm cho Cửa hàng Đặc sản Đà Lạt

### Sinh viên thực hiện
| STT | Họ và tên               | MSSV    | Lớp    | Email liên hệ        |
| --- | ----------------------- | ------- | ------ | -------------------- |
| 1   | Nguyễn Ngọc Hân         | 2312607 | CTK47A | 2312607@dlu.edu.vn   |
| 2   | Phan Trung Hiếu         | 2312616 | CTK47A | 2312616@dlu.edu.vn   |
| 3   | Nguyễn Thị Trường Nga   | 2312697 | CTK47A | 2312697@dlu.edu.vn   |

**Giảng viên hướng dẫn**: Ks. Nguyễn Trọng Hiếu

### 1. Tổng quan đề tài
Trong bối cảnh thương mại điện tử ngày càng phát triển, việc xây dựng kênh giới thiệu sản phẩm trực tuyến là cần thiết cho cửa hàng đặc sản địa phương. Đề tài xây dựng một “catalog trực tuyến” giúp trưng bày sản phẩm trực quan, nâng cao thương hiệu và thu hút khách hàng; không tích hợp chức năng bán hàng phức tạp.

### 2. Mục tiêu đề tài
- Xây dựng trang web đóng vai trò “catalog trực tuyến” chuyên nghiệp cho cửa hàng nhỏ (không bán hàng online).  
- Tập trung hiển thị sản phẩm qua các trang: Trang chủ, Danh sách sản phẩm, Chi tiết sản phẩm (mô tả đầy đủ).  
- Thiết kế UI hiện đại, gọn gàng, dễ dùng; tối ưu trải nghiệm xem sản phẩm.

### 3. Nội dung đề tài
- Phát triển website tập trung trình bày sản phẩm; ưu tiên thiết kế UI sạch, đẹp, dễ dùng.  
- Phân tích yêu cầu và thiết kế giao diện: Trang chủ, Danh sách, Chi tiết sản phẩm.  
- Xây dựng trang quản trị đơn giản để quản lý nội dung sản phẩm.

### 4. Phần mềm và công cụ sử dụng
- Ngôn ngữ: HTML5, CSS3, JavaScript  
- UI Framework: TailwindCSS (hoặc Bootstrap)  
- Frontend Framework: React + Vite  
- Công cụ: VS Code, GitHub, Figma, Postman  
- Trình duyệt kiểm thử: Chrome, Firefox  
- Dữ liệu: Firebase Firestore (kèm Storage tuỳ chọn)

### 5. Kế hoạch thực hiện
| STT | Công việc                                                        | Thời gian                | Ghi chú |
| --- | ---------------------------------------------------------------- | ------------------------ | ------- |
| 1   | Khảo sát, thu nhập tài liệu, viết đề cương                      | 12/08/2025 – 19/08/2025 |         |
| 2   | Phân tích yêu cầu hệ thống, xác định chức năng cần thiết        | 20/08/2025 – 25/08/2025 |         |
| 3   | Thiết kế cơ sở dữ liệu và kiến trúc hệ thống                    | 25/08/2025 – 06/09/2025 |         |
| 4   | Thiết kế giao diện hệ thống bằng Figma                          | 07/09/2025 – 19/09/2025 |         |
| 5   | Xây dựng cấu trúc dự án, cài đặt môi trường và công cụ         | 20/09/2025 – 25/09/2025 |         |
| 6   | Lập trình giao diện người dùng (Frontend)                       | 29/09/2025 – 05/10/2025 |         |
| 7   | Phát triển trang quản trị (Admin) để quản lý sản phẩm           | 06/10/2025 – 15/10/2025 |         |
| 8   | Tích hợp dữ liệu (Dữ liệu sản phẩm)                             | 16/10/2025 – 23/10/2025 |         |
| 9   | Kiểm thử hệ thống (chức năng, giao diện, tương thích trình duyệt)| 24/10/2025 – 30/10/2025 |         |
| 10  | Sửa chữa, hoàn thiện đồ án                                      | 20/11/2025 – 24/11/2025 |         |
| 11  | Báo cáo đồ án theo hội đồng                                     | 25/11/2025 – 30/11/2025 |         |

### 6. Dự kiến kết quả đạt được
- Một trang web hoàn chỉnh giới thiệu sản phẩm đặc sản Đà Lạt với giao diện trực quan, hấp dẫn.  
- Báo cáo mô tả quá trình thực hiện và đánh giá kết quả.

### 7. Tài liệu tham khảo
- W3Schools – HTML/CSS/JS: `https://www.w3schools.com`  
- React – `https://react.dev`  
- TailwindCSS – `https://tailwindcss.com`  
- Các website tham khảo giao diện catalog sản phẩm.

---

## Phần bổ sung theo triển khai thực tế của dự án

- Public: sản phẩm nổi bật 1 hàng, danh mục nền ấm, About/Events thiết kế lại, Contact có bản đồ, empty state bằng hình.  
- Admin: đăng nhập demo (localStorage), bảo vệ `/admin/*`; quản lý Products/Events; Contacts (tìm kiếm, lọc trạng thái & theo ngày, phân trang, đổi trạng thái, xuất CSV); Notifications realtime từ Firestore (đếm unread, đánh dấu đã đọc, xem chi tiết); Analytics theo chu kỳ (Visits/Events/Products) và xuất CSV/XLSX nhiều sheet.  
- Firestore collections: `products`, `events`, `messages`, `notifications`, `activities`, `stats/daily`.  
- Hướng dẫn triển khai/biến môi trường: xem `README_DEPLOY.md`.  
- Gợi ý bảo mật khi phát hành: dùng Firebase Auth + rules an toàn (mẫu rules trong `firebase/firestore.rules`).

Đà Lạt, ngày ..... tháng ..... năm 2025  
Giáo viên hướng dẫn (ký tên)  |  SV thực hiện (ký tên)

---

## Kiến trúc dự án và chức năng các file

### A) Tổng quan kiến trúc
- Kiểu kiến trúc: SPA (Single Page Application) với React + Vite.  
- Phân tầng: UI Components (presentational) ↔ Pages (route-level) ↔ Context (state) ↔ Services (Firestore/Storage).  
- Dữ liệu: Firestore theo các collection `products`, `events`, `messages`, `notifications`, `activities`, `stats/daily`.

Luồng chính (ví dụ liên hệ): `pages/Contact.jsx` → `services/apiService.messagesAPI.create` → ghi `messages` và tạo `notifications`/`activities` → `components/admin/AdminHeader.jsx` nghe realtime → admin mở `pages/admin/AdminContacts.jsx` để xem/đổi trạng thái.

### B) Cấu trúc thư mục rút gọn (có chú thích)
```
DaLatFarm/DaLatFarm/
  public/                             # Tài nguyên tĩnh (logo, favicon, ảnh OG)
  src/
    components/
      layout/
        Header.jsx                    # Header phía public
        Footer.jsx                    # Footer phía public
      admin/
        AdminLayout.jsx               # Khung layout admin (sidebar + header + content)
        AdminHeader.jsx               # Header admin, chuông thông báo (realtime), menu user
        AdminSidebar.jsx              # Menu điều hướng admin (Dashboard, Products, Events, Contacts...)
        ProductForm.jsx               # Modal thêm/sửa sản phẩm, chặn scroll, UI chuẩn
        ProductTable.jsx              # (nếu dùng) Bảng sản phẩm/CRUD
        EventForm.jsx / EventTable.jsx# Form/Bảng sự kiện
        RealTimeStatus.jsx            # Widget trạng thái demo
    pages/
      Home.jsx / About.jsx / Events.jsx / Contact.jsx / Products.jsx / ProductDetail.jsx / NotFound.jsx
      admin/
        AdminLogin.jsx                # Đăng nhập demo (localStorage)
        AdminHome.jsx                 # Dashboard: số liệu nhanh, recent products
        AdminProducts.jsx             # Quản lý sản phẩm (mở ProductForm)
        AdminEvents.jsx               # Quản lý sự kiện
        AdminProfile.jsx              # Cập nhật name/email/phone/bio/avatar (localStorage)
        AdminContacts.jsx             # Liên hệ: tìm kiếm, lọc trạng thái/ngày, phân trang, chi tiết, xuất CSV
        AdminAnalytics.jsx            # Thống kê theo chu kỳ; xuất CSV/XLSX nhiều sheet
        AdminUsers.jsx / AdminRealTime.jsx / AdminActivity.jsx # Trang phụ trợ
    routes/
      AppRoutes.jsx                   # Route public
      AdminRoutes.jsx                 # Bảo vệ admin routes bằng guard (localStorage demo)
    context/
      ProductContext.jsx              # Cung cấp products/categories toàn app (nếu dùng)
    services/
      apiService.js                   # Tầng dịch vụ tập trung (Firestore/Storage/Cloudinary)
    config/
      firebase.js                     # Khởi tạo Firebase (apiKey...)
  README.md / README_DEPLOY.md       # Tài liệu dự án & triển khai
```

### C) Chức năng các file quan trọng
- `src/services/apiService.js` (trọng tâm dịch vụ):
  - `productsAPI`: `getAll`, `getById`, `create`, `update`, `delete`, `incrementViews`, `resetAllViews`.
  - `eventsAPI`: `getAll`, `create`, `update`, `delete`.
  - `messagesAPI`: `create` (từ Contact), `getAll` (admin Contacts), `updateStatus` (đổi trạng thái).
  - `notificationsAPI`: `push`, `getAll`, `markAsRead`, `markAllAsRead`.
  - `activitiesAPI`: `log`, `getRecent`.
  - `statsAPI`: `trackDailyVisit`, `getTodayVisitCount`, `incrementVisit`, `getDailyMap`.
  - `uploadAPI`: `upload`/`uploadImage` (Cloudinary ưu tiên, fallback Storage).

- `src/components/admin/AdminHeader.jsx`:
  - Đọc profile từ localStorage và lắng nghe sự kiện `dalatfarm:admin:profileUpdated` để đồng bộ UI.
  - Chuông thông báo: `onSnapshot` Firestore theo realtime; đếm unread; mở modal chi tiết; mark read/all; điều hướng theo loại thông báo (product/event/message → contacts/activity...).

- `src/pages/admin/AdminContacts.jsx`:
  - Lấy danh sách từ `messagesAPI.getAll()`.  
  - Tìm kiếm theo text, lọc trạng thái, lọc theo ngày; phân trang; xuất CSV; modal chi tiết (UI giống ProductForm); `updateStatus` sang `in_progress/done`.

- `src/pages/admin/AdminAnalytics.jsx`:
  - Gom số liệu: tổng quan, trends (so sánh kỳ), category stats, top products, monthly visits.  
  - Xuất báo cáo: CSV (UTF-8 BOM) và XLSX (nhiều sheet, dùng SheetJS).

- `src/components/admin/ProductForm.jsx`:
  - Modal thêm/sửa sản phẩm: validate, khóa scroll nền, preview ảnh, nén/đẩy ảnh, submit dữ liệu sạch.

### D) Định tuyến & bảo vệ
- Public routes tại `routes/AppRoutes.jsx`.  
- Admin routes tại `routes/AdminRoutes.jsx`; guard kiểm tra `localStorage['dalatfarm:admin:auth'] === '1'` (demo). Khi triển khai thật, chuyển sang Firebase Auth + custom claims (tham khảo `firebase/firestore.rules`).

### E) Quy ước dữ liệu (tối thiểu)
- Mọi document đều có `createdAt` (timestamp số) và (nếu chỉnh sửa) `updatedAt`.  
- `products.views` là số nguyên; `messages.status ∈ { 'new','in_progress','done' }`.


