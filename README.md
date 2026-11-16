# Nguyễn Kiều Anh — portfolio

Trang portfolio tĩnh cho **Nguyễn Kiều Anh** ([@kieuanhdev](https://github.com/kieuanhdev)). Tiếng Việt là ngôn ngữ mặc định, có nút chuyển sang tiếng Anh. Danh sách kho đọc trực tiếp từ GitHub REST API.

## Sửa nội dung

Mọi thông tin cá nhân nằm trong một file:

`src/data/site.ts`

Trong đó có:

- tên, chức danh, đoạn giới thiệu, dòng thời gian
- nhóm kỹ năng
- `featured` — kho muốn đưa lên đầu (đúng tên repo trên GitHub, kèm đoạn tóm tắt song ngữ)
- `contacts` — GitHub, email, LinkedIn, Facebook

Email và mạng xã hội đang để mẫu (`placeholder: true`). Đổi `href`, rồi đặt `placeholder: false` khi link đã là của bạn. Nhãn nút, menu và thông báo lỗi nằm ở `src/lib/copy.ts`.

## Chạy trên máy

Cần Node.js 22.

```bash
npm install
npm run dev
```

Mở http://127.0.0.1:47281

```bash
npm run build    # kiểm tra TypeScript rồi xuất thư mục dist/
npm run preview  # xem bản build
npm run lint
```

## Dữ liệu GitHub

Trình duyệt gọi:

- `https://api.github.com/users/kieuanhdev`
- `https://api.github.com/users/kieuanhdev/repos?per_page=100`
- `https://api.github.com/users/kieuanhdev/events/public`

API công khai không cần token (khoảng 60 request/giờ/địa chỉ IP). Trang nhớ kết quả 30 phút trong `localStorage`.

Nếu GitHub từ chối hoặc mạng lỗi, trang dùng bản lưu trong `src/data/fallback.ts` và hiện một dòng giải thích. Làm mới bản lưu:

```bash
npm run fallback
```

Xem thử chế độ dự phòng: http://127.0.0.1:47281/?github=fallback

Thẻ dự án nổi bật lấy mô tả từ `featured` trong `site.ts`. Ngôn ngữ, số sao và ngày đẩy lấy từ API (hoặc từ bản lưu khi API lỗi). Phần “Mọi kho công khai” sắp theo lần đẩy gần nhất hoặc theo số sao, lọc theo ngôn ngữ, và có thể hiện fork.

## Đưa lên Vercel

1. Đẩy repo lên GitHub.
2. Import project trên Vercel, framework **Vite**.
3. Build command: `npm run build`. Output: `dist`.
4. Không cần biến môi trường.

## Đưa lên GitHub Pages

Site người dùng nằm ở https://kieuanhdev.github.io (repo `kieuanhdev.github.io`). Asset dùng đường dẫn gốc `/`, không thêm tên repo.

Workflow `.github/workflows/pages.yml` build và deploy mỗi lần đẩy lên `main`. Nó dùng `actions/configure-pages`, `actions/upload-pages-artifact` và `actions/deploy-pages`, với `BASE_PATH=/`.

1. Vào repo trên GitHub → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Đẩy nhánh `main`. Vài phút sau trang ở https://kieuanhdev.github.io.

Nếu Actions báo lỗi quyền Pages, kiểm tra lại đúng mục Source ở trên. Repo phải public, hoặc tài khoản có GitHub Pro để Pages chạy từ repo private.

Deploy tay:

```bash
npm run build
```

`dist/` là site tĩnh cho Vercel hoặc bất kỳ host nào cũng phục vụ ở `/`.
