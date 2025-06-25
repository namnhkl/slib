import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from 'environments/environment';

if (environment.production) {
  console.log = () => {};
  console.debug = () => {};
  console.warn = () => {};
  console.info = () => {};
  console.error = () => {}; // ❗ Chỉ dùng khi thật sự muốn ẩn toàn bộ error

  window.onerror = () => true;

  // ✅ Ép kiểu để tránh lỗi TypeScript
  (Error as any).stackTraceLimit = 0;
}

// ✅ Bắt đầu khởi tạo ứng dụng
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err)); // Giữ lại console.error cho lỗi khởi tạo
