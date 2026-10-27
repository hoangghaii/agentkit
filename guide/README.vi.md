# Hướng dẫn AgentKit Engineer

Cần Node.js 20 trở lên. Trong thư mục source đã giải nén, chạy `npm ci`. Sau đó cài vào dự án:

```sh
node bin/agentkit.mjs install --target "/đường dẫn/dự án" --agents codex,claude --packs core,web
```

Mặc định cài `core` và cả hai nền tảng. Các nhóm khác: `backend-data`, `platform`, `documents`, `ai-media`, `quality`. Bộ nền không cần API key; chỉ cấu hình dịch vụ ngoài khi dùng skill tương ứng. Chạy `doctor --target "..."` để xem dependency tùy chọn còn thiếu.

Trong Codex dùng `$kit-plan`, `$kit-implement`, `$kit-debug`, `$kit-fix`, `$kit-test`, `$kit-review`. Trong Claude có thể tiếp tục dùng `/plan`, `/cook`, `/fix:ci` và các alias đã chuyển đổi. Biến thể `fast`, `hard`, `auto` là tham số của workflow. Việc nhỏ làm trực tiếp; việc phức tạp dùng vai trò phù hợp nếu host hỗ trợ, hoặc xử lý tuần tự. TDD chỉ dùng khi được chọn và đã cài `quality`.

Thêm `--dry-run` để xem file dự kiến thay đổi. Khi cài lại hoặc đổi nhóm, truyền đầy đủ danh sách nhóm mong muốn. Cấu hình dự án được merge theo phần quản lý; file đã sửa gây báo xung đột trước khi ghi. Manifest nằm ở `.agentkit/manifest.json`. Giữ manifest để update/uninstall phân biệt file của bộ cài với file của bạn.

`update --check` xem diff từ source hiện tại và so sánh commit upstream qua GitHub; dùng `--offline` để chỉ kiểm tra source đã ghim. Các snapshot upstream được ghim commit trong `kit/upstreams.json`; nhập phiên bản mới cần xem diff và cập nhật checksum. `uninstall` chỉ xóa file quản lý chưa bị sửa; các chỉnh sửa còn lại được giữ và báo rõ. Không cần Git trong dự án đích.

Sau khi cài, mở lại host nếu cần để nhận skill và agent. Tin cậy dự án và xem xét hai hook trong giao diện host. Hook chỉ nhắc tìm kiếm có phạm vi và gợi ý chia module; không gửi dữ liệu ra dịch vụ ngoài. Các mẫu MCP ở `.agentkit/templates/` chưa được tự bật.

Nhóm `documents` giữ công cụ cũ cho DOCX/PDF/PPTX/XLSX. Các thư viện Python, LibreOffice, công cụ render hoặc Node package chuyên ngành cần được cài theo task. Đọc hướng dẫn và điều khoản trong từng skill. Khi tạo tài liệu, đọc lại nội dung và render để kiểm tra bố cục; không coi file ghi thành công là đã kiểm chứng hình thức.

Xem [mapping command](COMMANDS.md), [danh mục skill](SKILLS.md), [báo cáo kiểm kê](../docs/inventory.md) và [báo cáo kiểm thử](../docs/verification.md).
