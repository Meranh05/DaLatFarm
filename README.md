### Trường Đại học Đà Lạt – Khoa Công nghệ Thông tin

### ĐỀ CƯƠNG THỰC HIỆN ĐỒ ÁN

### Tên đề tài

Trang Web Giới thiệu Sản phẩm cho Cửa hàng Đặc sản Đà Lạt

### Thông tin nhóm thực hiện

- **Giảng viên hướng dẫn**: Ks. Nguyễn Trọng Hiếu
- **Sinh viên thực hiện**:

| STT | Họ và tên             | MSSV    | Lớp    | Email liên hệ      |
| --- | --------------------- | ------- | ------ | ------------------ |
| 1   | Nguyễn Ngọc Hân       | 2312607 | CTK47A | 2312607@dlu.edu.vn |
| 2   | Phan Trung Hiếu       | 2312616 | CTK47A | 2312616@dlu.edu.vn |
| 3   | Nguyễn Thị Trường Nga | 2312697 | CTK47A | 2312697@dlu.edu.vn |

### 1. Tổng quan đề tài

Trong bối cảnh thương mại điện tử phát triển mạnh, một kênh giới thiệu sản phẩm trực tuyến (catalog online) giúp cửa hàng đặc sản địa phương trưng bày sản phẩm trực quan, nâng cao hình ảnh thương hiệu và thu hút khách hàng. Đề tài xây dựng một trang web giới thiệu sản phẩm đặc sản Đà Lạt, tập trung vào trình bày nội dung hấp dẫn, dễ tiếp cận, không tích hợp chức năng bán hàng trực tuyến phức tạp.

### 2. Mục tiêu đề tài

- Xây dựng một trang web như một "catalog trực tuyến" chuyên nghiệp cho cửa hàng nhỏ, không bán hàng online.
- Tập trung hiển thị thông tin sản phẩm hấp dẫn qua các trang: Trang chủ, Danh sách sản phẩm, Chi tiết sản phẩm.
- Thiết kế UI hiện đại, gọn gàng, dễ sử dụng; tối ưu trải nghiệm xem sản phẩm.

### 3. Nội dung thực hiện

- Phát triển website tập trung vào hiển thị thông tin sản phẩm; ưu tiên thiết kế UI sạch, đẹp, dễ dùng.
- Phân tích yêu cầu và thiết kế giao diện các trang: Home, Products, Product Detail.
- Xây dựng trang quản trị đơn giản để quản lý thông tin sản phẩm.

### 4. Phần mềm và công cụ sử dụng

- **Ngôn ngữ**: HTML5, CSS3, JavaScript
- **Thư viện/UI**: Bootstrap hoặc TailwindCSS
- **Frontend Framework**: React.js (ưu tiên) hoặc Vue.js
- **Công cụ**: VS Code, GitHub, Figma, Postman
- **Trình duyệt kiểm thử**: Google Chrome, Firefox
- **Backend/Dữ liệu**: Firebase (Firestore, Auth, Storage) – không cần backend riêng

### 5. Kế hoạch thực hiện

| STT | Công việc                                                  | Thời gian               | Ghi chú |
| --- | ---------------------------------------------------------- | ----------------------- | ------- |
| 1   | Khảo sát, thu thập tài liệu, viết đề cương                 | 12/08/2025 – 19/08/2025 |         |
| 2   | Phân tích yêu cầu, xác định chức năng                      | 20/08/2025 – 25/08/2025 |         |
| 3   | Thiết kế CSDL và kiến trúc hệ thống                        | 25/08/2025 – 06/09/2025 |         |
| 4   | Thiết kế giao diện bằng Figma                              | 07/09/2025 – 19/09/2025 |         |
| 5   | Xây dựng cấu trúc dự án, cài đặt môi trường                | 20/09/2025 – 25/09/2025 |         |
| 6   | Lập trình giao diện người dùng (Frontend)                  | 29/09/2025 – 05/10/2025 |         |
| 7   | Phát triển trang quản trị (Admin)                          | 06/10/2025 – 15/10/2025 |         |
| 8   | Tích hợp dữ liệu (sản phẩm, sự kiện)                       | 16/10/2025 – 23/10/2025 |         |
| 9   | Kiểm thử hệ thống (chức năng, UI, tương thích trình duyệt) | 24/10/2025 – 30/10/2025 |         |
| 10  | Sửa lỗi, hoàn thiện                                        | 20/11/2025 – 24/11/2025 |         |
| 11  | Báo cáo đồ án                                              | 25/11/2025 – 30/11/2025 |         |

### 6. Dự kiến kết quả đạt được

- Website giới thiệu sản phẩm đặc sản Đà Lạt hoàn chỉnh, trực quan, hấp dẫn.
- Báo cáo mô tả quá trình thực hiện và đánh giá kết quả.

### 7. Tài liệu tham khảo

- W3Schools – tài liệu HTML/CSS/JS: [w3schools.com](https://www.w3schools.com)
- React – trang chính thức: [react.dev](https://react.dev)
- Bootstrap: [getbootstrap.com](https://getbootstrap.com)
- TailwindCSS: [tailwindcss.com](https://tailwindcss.com)
- Các website tham khảo giao diện catalog sản phẩm.

### 8. Cấu trúc thư mục (tóm tắt)

```
DaLatSpecialties/
  public/
    favicon.ico
    logo.png
    index.html
  src/
    assets/
      images/
      icons/
      fonts/
    components/
      layout/ (Header, Footer, Navbar, Sidebar)
      common/ (Button, Card, Input, Modal, Spinner)
      home/ (HeroBanner, FeaturedProducts, CategoriesSection, HomeEvents)
      product/ (ProductCard, ProductList, ProductFilter, ProductDetailInfo)
      admin/ (ProductTable, ProductForm, EventTable, EventForm, AdminSidebar, AdminHeader)
    pages/
      Home.jsx, About.jsx, Contact.jsx, Events.jsx, Search.jsx,
      Products.jsx, ProductDetail.jsx, NotFound.jsx, Unauthorized.jsx,
      admin/ (AdminLogin.jsx, AdminHome.jsx, AdminProfile.jsx, AdminProducts.jsx)
    routes/ (AppRoutes.jsx, ProtectedRoute.jsx, AdminRoutes.jsx)
    context/ (AuthContext.jsx, ProductContext.jsx)
    services/ (firebase.js, productService.js, authService.js, eventService.js)
    hooks/ (useAuth.js, useProducts.js)
    styles/ (index.css, variables.css)
    utils/ (helpers.js)
  App.jsx
  main.jsx
  package.json
  tailwind.config.js
  postcss.config.js
  vite.config.js
```

### 9. Chức năng các trang (User side)

- **Home**: Banner, sản phẩm nổi bật, danh mục.
- **Products**: Catalog sản phẩm, lọc theo danh mục (Trà, Mứt, Cà phê, …).
- **ProductDetail**: Ảnh, mô tả, đặc điểm sản phẩm.
- **Events**: Danh sách sự kiện khuyến mãi, festival Đà Lạt.
- **About**: Giới thiệu cửa hàng, tầm nhìn, giá trị.
- **Contact**: Form liên hệ, thông tin liên lạc.
- **Search**: Kết quả tìm kiếm sản phẩm.
- **NotFound (404)** và **Unauthorized (401)**.

### 10. Trang quản trị (Admin side)

- **Đăng nhập/Đăng ký admin** (Firebase Auth).
- **Admin Home**: Dashboard (thống kê sản phẩm, sự kiện, lượt xem cơ bản).
- **Admin Profile**: Thông tin cá nhân admin.
- **Admin Products**: Quản lý sản phẩm (CRUD, ẩn/hiện, tìm kiếm trực tiếp).
- **Đăng xuất**: Thông báo và điều hướng an toàn.

### 11. Tích hợp Firebase

- **Firestore Database**: Lưu thông tin sản phẩm, sự kiện, admin.
- **Firebase Auth**: Quản lý tài khoản admin.
- **Firebase Storage**: Lưu ảnh sản phẩm, banner.
- **Realtime update**: Thêm/xóa/sửa dữ liệu cập nhật tức thời lên frontend.

### 12. Hướng dẫn phát triển nhanh

- **Thêm component mới**: Đặt vào `src/components/...` để tái sử dụng.
- **Thêm page mới**: Định nghĩa trong `src/routes/AppRoutes.jsx` và tạo file trong `src/pages`.
- **Dữ liệu**: Tương tác qua `src/services/*` với cấu hình Firebase trong `src/services/firebase.js`.

### 13. Thiết lập và chạy dự án

- Cấu hình Vite + React + Tailwind theo `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`.
- Cài đặt: `npm install`
- Chạy dev: `npm run dev`
- Build: `npm run build`

### 14. Cấu trúc cụ thể và ghi chú

```
DaLatSpecialties/
├── public/                      # Tài nguyên tĩnh, được phục vụ trực tiếp
│   ├── favicon.ico              # Biểu tượng trang
│   ├── logo.png                 # Logo dự án (hiển thị trên header/login)
│   └── index.html               # HTML gốc cho Vite mount ứng dụng React
│
├── src/                         # Mã nguồn ứng dụng React
│   ├── assets/                  # Tài nguyên cần import trong mã nguồn
│   │   ├── images/              # Ảnh dùng trong component (được bundler xử lý)
│   │   ├── icons/               # SVG/PNG icon
│   │   └── fonts/               # Webfonts (woff/woff2)
│   │
│   ├── components/              # Các component tái sử dụng theo domain
│   │   ├── layout/              # Khung giao diện chung
│   │   │   ├── Header.jsx       # Header trang user
│   │   │   ├── Footer.jsx       # Footer chung
│   │   │   ├── Navbar.jsx       # Thanh điều hướng chính
│   │   │   └── Sidebar.jsx      # Sidebar (dùng cho user hoặc admin nếu cần)
│   │   │
│   │   ├── common/              # Thành phần UI nhỏ, tái sử dụng cao
│   │   │   ├── Button.jsx       # Nút dùng chung (primary/secondary/...)
│   │   │   ├── Card.jsx         # Thẻ hiển thị nội dung/sản phẩm
│   │   │   ├── Input.jsx        # Trường nhập liệu dùng chung
│   │   │   ├── Modal.jsx        # Hộp thoại
│   │   │   └── Spinner.jsx      # Loading spinner
│   │   │
│   │   ├── home/                # Thành phần riêng cho trang chủ
│   │   │   ├── HeroBanner.jsx   # Banner lớn đầu trang
│   │   │   ├── FeaturedProducts.jsx  # Sản phẩm nổi bật
│   │   │   ├── CategoriesSection.jsx # Danh mục sản phẩm
│   │   │   └── HomeEvents.jsx   # Sự kiện ở trang chủ
│   │   │
│   │   ├── product/             # Thành phần phục vụ trang sản phẩm
│   │   │   ├── ProductCard.jsx        # Thẻ sản phẩm đơn
│   │   │   ├── ProductList.jsx        # Lưới/danh sách sản phẩm
│   │   │   ├── ProductFilter.jsx      # Bộ lọc (danh mục, giá, từ khóa)
│   │   │   └── ProductDetailInfo.jsx  # Thông tin chi tiết sản phẩm
│   │   │
│   │   └── admin/               # Thành phần cho trang quản trị
│   │       ├── ProductTable.jsx # Bảng sản phẩm (CRUD, ẩn/hiện)
│   │       ├── ProductForm.jsx  # Form thêm/sửa sản phẩm
│   │       ├── EventTable.jsx   # Bảng sự kiện
│   │       ├── EventForm.jsx    # Form thêm/sửa sự kiện
│   │       ├── AdminHeader.jsx  # Header khu vực admin
│   │       └── AdminSidebar.jsx # Sidebar điều hướng admin
│   │
│   ├── pages/                   # Trang (route-level)
│   │   ├── Home.jsx             # Trang chủ
│   │   ├── About.jsx            # Giới thiệu
│   │   ├── Contact.jsx          # Liên hệ
│   │   ├── Events.jsx           # Danh sách sự kiện
│   │   ├── Search.jsx           # Kết quả tìm kiếm
│   │   ├── Products.jsx         # Catalog sản phẩm
│   │   ├── ProductDetail.jsx    # Chi tiết sản phẩm
│   │   ├── NotFound.jsx         # 404
│   │   ├── Unauthorized.jsx     # 401
│   │   └── admin/
│   │       ├── AdminLogin.jsx   # Đăng nhập admin
│   │       ├── AdminHome.jsx    # Dashboard admin
│   │       ├── AdminProfile.jsx # Hồ sơ admin
│   │       └── AdminProducts.jsx# Quản lý sản phẩm
│   │
│   ├── routes/                  # Định tuyến
│   │   ├── AppRoutes.jsx        # Khai báo tất cả route chính
│   │   ├── ProtectedRoute.jsx   # Bảo vệ route (yêu cầu đăng nhập/admin)
│   │   └── AdminRoutes.jsx      # Gom nhóm route cho admin
│   │
│   ├── context/                 # State toàn cục (React Context)
│   │   ├── AuthContext.jsx      # Trạng thái đăng nhập (Firebase Auth)
│   │   └── ProductContext.jsx   # Trạng thái/danh sách sản phẩm
│   │
│   ├── services/                # Tầng làm việc với Firebase
│   │   ├── firebase.js          # Cấu hình Firebase (apiKey, projectId...)
│   │   ├── productService.js    # Hàm CRUD sản phẩm
│   │   ├── authService.js       # Đăng ký/đăng nhập/đăng xuất admin
│   │   └── eventService.js      # CRUD sự kiện
│   │
│   ├── hooks/                   # Custom hooks
│   │   ├── useAuth.js           # Hook tiện ích cho xác thực
│   │   └── useProducts.js       # Hook lấy và quản lý sản phẩm
│   │
│   ├── styles/                  # CSS/Tailwind custom
│   │   ├── index.css            # CSS gốc, import Tailwind layer nếu dùng
│   │   └── variables.css        # Biến CSS (màu sắc, spacing...) nếu cần
│   │
│   └── utils/                   # Hàm tiện ích chung
│       └── helpers.js           # Định nghĩa các helper thuần JS
│
├── src/App.jsx                  # Điểm vào app, bọc router/provider
├── src/main.jsx                 # Mount React vào #root (Vite entry)
├── package.json                 # Script, dependency, engine
├── tailwind.config.js           # Cấu hình TailwindCSS
├── postcss.config.js            # Cấu hình PostCSS
├── vite.config.js               # Cấu hình Vite
└── README.md                    # Tài liệu dự án
```

Ghi chú nhanh

- Ưu tiên đặt component tái sử dụng vào `components/common` và domain-specific vào thư mục domain tương ứng.
- Mọi tương tác dữ liệu đi qua `services/*`; không gọi Firebase trực tiếp trong component.
- Dùng `context/*` cho state dùng chung (auth, products). State cục bộ giữ trong component/hook.
- Khai báo route tại `routes/AppRoutes.jsx`; bọc route cần bảo vệ bằng `ProtectedRoute`.
- Ảnh public (favicon, logo) để trong `public/`; ảnh cần tối ưu bundling đặt trong `src/assets/images`.
- Tạo page mới: thêm file trong `src/pages` và đăng ký route trong `AppRoutes.jsx`.
