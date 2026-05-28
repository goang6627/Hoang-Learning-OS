  # Hướng Dẫn Sử Dụng Hoàng Learning OS

## 1. Mở web app

Trong lúc dev server đang chạy, mở trình duyệt tại:

```txt
http://127.0.0.1:5174/
```

Nếu port thay đổi, xem dòng `Local:` trong terminal khi chạy:

```txt
npm run dev
```

## 2. Mục tiêu của app

Hoàng Learning OS giúp trả lời nhanh:

```txt
Hôm nay cần học gì để cứu GPA?
Môn nào đang nguy hiểm?
Kỳ 2 cần ưu tiên môn nào?
4 năm tới đang đi được bao nhiêu tín chỉ?
```

Dữ liệu chính đang dùng:

```txt
Current GPA: 2.50/4.00
Completed credits: 14/122
Academic phase: Recovery Phase
```

## 3. Dashboard

Trang này dùng để xem nhanh tình trạng hiện tại.

Các phần quan trọng:

- `Current GPA`: GPA thật hệ 4.
- `Credit Progress`: tiến độ tín chỉ theo `122`, không dùng catalog `231`.
- `Today Focus`: 3 việc chính trong ngày.
- `Risk Alerts`: các môn đang ở mức `watch`, `high`, hoặc `critical`.
- `Recovery Subjects`: các môn đã học nhưng cần phục hồi nền.

Cách dùng hằng ngày:

1. Mở Dashboard.
2. Xem `Today Focus`.
3. Làm lần lượt 3 task.
4. Bấm vào task để đánh dấu đã xong.

## 4. Curriculum Roadmap

Trang này là bản đồ chương trình học.

Nên dùng để:

- Xem môn đã học, đang học, sắp học.
- Lọc môn theo học kỳ.
- Lọc theo tag như `GPA`, `CP`, `CS`, `SE`, `AI`.
- Xem môn nào có `riskLevel`, `importance`, `completionStatus`.
- Kiểm tra tiến độ từng nhóm kiến thức.

Lưu ý:

```txt
Các nhóm chuyên ngành như Công nghệ phần mềm hoặc Mạng máy tính chỉ được tính vào tiến độ chính khi được chọn trong Settings.
```

## 5. GPA Recovery Map

Trang này dùng để phục hồi GPA.

Các mục cần xem:

- GPA hiện tại.
- GPA tương lai cần đạt để lên `3.00`, `3.20`, `3.60`.
- Các môn recovery:
  - `TOA1012` - Cơ sở toán.
  - `TIN1093` - Nhập môn lập trình.
  - `TIN3173` - Lập trình Front-End.
- Kế hoạch phục hồi 30 ngày.

Cách dùng:

1. Xem mục `Required Future GPA`.
2. Chọn mục tiêu gần nhất là `3.00`.
3. Làm theo `30-Day Recovery Plan`.
4. Không để kỳ sau có thêm D/F.

## 6. Semester Planner

Trang này dùng cho kế hoạch học kỳ 2.

Mục tiêu:

```txt
Semester GPA target: >= 3.20
No subject below B
At least 2 critical subjects reach A/A-
```

Các môn ưu tiên:

- `TIN3083` - Lập trình nâng cao.
- `TIN1083` - Kỹ thuật lập trình.
- `TIN3183` - Cơ sở dữ liệu.
- `TOA1023` - Đại số tuyến tính.
- `LLCTKT2` - Kinh tế chính trị Mác - Lênin.

Cách dùng:

1. Xem `Subject Priority`.
2. Ưu tiên môn có `importance: critical`.
3. Dùng `Weekly Schedule Template` để chia việc theo ngày.
4. Chủ nhật chuyển sang `Weekly Review`.

## 7. Weekly Review

Trang này dùng để chốt lại tuần học.

Mỗi Chủ nhật nên trả lời:

```txt
1. Môn nào tuần này nguy hiểm nhất?
2. Có assignment nào chưa xong không?
3. Mình có học dồn không?
4. CP có upsolve không?
5. Môn nào cần tăng thời lượng tuần sau?
```

Sau khi nhập xong, bấm:

```txt
Save Weekly Review
```

Dữ liệu sẽ được lưu trong localStorage và vẫn còn sau khi refresh.

## 8. Settings

Trang này dùng để cấu hình app.

Có thể làm:

- Sửa GPA target.
- Chọn chuyên ngành chính.
- Export JSON để backup.
- Import JSON để khôi phục.
- Reset seed data.

### Export JSON

Dùng khi muốn sao lưu dữ liệu.

```txt
Settings -> Export JSON
```

### Import JSON

Dùng khi muốn khôi phục backup.

```txt
Settings -> Import JSON
```

### Reset seed data

Dùng khi muốn đưa app về dữ liệu mặc định v3.

```txt
Settings -> Reset seed data
```

Lưu ý: reset sẽ thay dữ liệu hiện tại bằng seed data.

## 9. Quy trình dùng app mỗi ngày

```txt
1. Mở Dashboard.
2. Làm 3 task trong Today Focus.
3. Nếu có Risk Alerts, xử lý môn đó trước.
4. Xem Semester Planner nếu chưa biết học gì trong tuần.
5. Chủ nhật vào Weekly Review.
6. Mỗi tuần export JSON một lần để backup.
```

## 10. Quy tắc hiện tại

```txt
Không thêm D/F.
Môn kỳ 2 tối thiểu B.
Môn core CNTT cố gắng B+/A.
Toán và lập trình phải phục hồi trước.
Không chỉ AC bài CP mà không upsolve.
```
