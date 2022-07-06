# MTLKMS - App học tập của nhà vịt :duck:
URL: https://mtlkms.github.io  
Author: *cuikho210*

## Kho lưu trữ
Backend: https://github.com/cuikho210/mtlkms-backend  
Frontend: https://github.com/cuikho210/mtlkms-frontend  
Build: https://github.com/mtlkms/mtlkms.github.io

## Dev
```bash
git clone https://github.com/cuikho210/mtlkms-frontend
cd mtlkms-frontend
npm install
npm run serve
```

Tại `/src/store/api.js`, sửa `API.host` cho khớp với máy chủ backend tại local của bạn. Yêu cầu HTTPS ở phía server.

## Build
Tại `/src/store/api.js`, sửa `API.host` cho khớp với máy chủ triển khai của bạn. Yêu cầu HTTPS ở phía server.  
Sau đó chạy:

```bash
npm run build
```

Dữ liệu đã build sẽ được lưu tại `/dist`
