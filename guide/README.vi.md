# Hướng dẫn AgentKit Engineer

Cần Node.js 20 trở lên. Trong thư mục source đã giải nén, chạy `npm ci`. Sau đó cài vào dự án:

```sh
node bin/agentkit.mjs install --target "/đường dẫn/dự án" --agents codex,claude --packs core,web
```

Mặc định cài `core` và cả hai nền tảng. Các nhóm khác: `backend-data`, `platform`, `documents`, `ai-media`, `quality`. Bộ nền không cần API key; chỉ cấu hình dịch vụ ngoài khi dùng skill tương ứng. Chạy `doctor --target "..."` để xem dependency tùy chọn còn thiếu.

Trong Codex dùng `$kit-plan`, `$kit-implement`, `$kit-debug`, `$kit-fix`, `$kit-test`, `$kit-review`. Trong Claude có thể tiếp tục dùng `/plan`, `/cook`, `/fix:ci` và các alias đã chuyển đổi. Biến thể `fast`, `hard`, `auto` là tham số của workflow. Việc nhỏ làm trực tiếp; việc phức tạp dùng vai trò phù hợp nếu host hỗ trợ, hoặc xử lý tuần tự. TDD chỉ dùng khi được chọn và đã cài `quality`.


Khi dùng `$kit-plan` hoặc `/plan`, mặc định plan được lưu vào dự án đích:

```text
plans/YYYYMMDD-HHmm-ten-tinh-nang/
├── plan.md
├── phase-01-thiet-ke.md
├── phase-02-trien-khai.md
└── phase-03-kiem-chung.md
```

`plan.md` là tổng quan và liên kết đến các phase; mỗi phase có các bước, checkbox và tiêu chí kiểm chứng riêng. Số phase tùy độ phức tạp, không cố định ba phase. `--fast` vẫn lưu file. Nếu chỉ muốn câu trả lời trong chat, yêu cầu rõ “chỉ trả lời inline, không tạo file”. Planner chỉ đọc sẽ bàn giao nội dung để agent chính ghi file.

Các alias giữ nhiệm vụ riêng:

| Claude | Codex | Nhiệm vụ |
| --- | --- | --- |
| `/brainstorm` | `$kit-plan --brainstorm` | So sánh phương án, chưa tạo các phase triển khai |
| `/plan` | `$kit-plan` | Lưu tổng quan và từng phase riêng |
| `/code` | `$kit-implement --from-plan` | Thực thi plan được cung cấp |
| `/cook` | `$kit-implement` | Triển khai tính năng được yêu cầu |
| `/bootstrap` | `$kit-implement --bootstrap` | Khởi tạo dự án mới trong phạm vi cho phép |
| `/debug` | `$kit-debug` | Chẩn đoán và đề xuất, không tự sửa code |
| `/test` | `$kit-test` | Chạy kiểm tra và báo cáo, không tự sửa để làm test qua |
| `/journal` | `$kit-status --journal` | Ghi nhật ký kỹ thuật dựa trên công việc thực tế |
| `/watzup` | `$kit-status` | Xem trạng thái, branch, thay đổi và tiến độ |

Khi triển khai theo plan, agent chính cập nhật checkbox và trạng thái phase sau khi đạt tiêu chí kiểm chứng; phần chưa xong vẫn để pending. Nếu uninstall chỉ gỡ được một phần vì file đã sửa, manifest giữ nhóm/nền tảng đã chọn để có thể khôi phục. Sửa xung đột rồi dùng `update`; không xóa manifest khi vẫn muốn quản lý các file đó.

Thêm `--dry-run` để xem file dự kiến thay đổi. Khi cài lại hoặc đổi nhóm, truyền đầy đủ danh sách nhóm mong muốn. Cấu hình dự án được merge theo phần quản lý; file đã sửa gây báo xung đột trước khi ghi. Manifest nằm ở `.agentkit/manifest.json`. Giữ manifest để update/uninstall phân biệt file của bộ cài với file của bạn.

`update --check` xem diff từ source hiện tại và so sánh commit upstream qua GitHub; dùng `--offline` để chỉ kiểm tra source đã ghim. Các snapshot upstream được ghim commit trong `kit/upstreams.json`; nhập phiên bản mới cần xem diff và cập nhật checksum. `uninstall` chỉ xóa file quản lý chưa bị sửa; các chỉnh sửa còn lại được giữ và báo rõ. Không cần Git trong dự án đích.

Sau khi cài, mở lại host nếu cần để nhận skill và agent. Tin cậy dự án và xem xét hai hook trong giao diện host. Hook chỉ nhắc tìm kiếm có phạm vi và gợi ý chia module; không gửi dữ liệu ra dịch vụ ngoài. Các mẫu MCP ở `.agentkit/templates/` chưa được tự bật.

Nhóm `documents` giữ công cụ cũ cho DOCX/PDF/PPTX/XLSX. Các thư viện Python, LibreOffice, công cụ render hoặc Node package chuyên ngành cần được cài theo task. Đọc hướng dẫn và điều khoản trong từng skill. Khi tạo tài liệu, đọc lại nội dung và render để kiểm tra bố cục; không coi file ghi thành công là đã kiểm chứng hình thức.

Xem [mapping command](COMMANDS.md), [danh mục skill](SKILLS.md), [báo cáo kiểm kê](../docs/inventory.md) và [báo cáo kiểm thử](../docs/verification.md).
