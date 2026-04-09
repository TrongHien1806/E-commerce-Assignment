import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Tự động tạo thư mục 'uploads' nếu chưa có
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Lưu vào thư mục 'uploads'
    },
    filename: (req, file, cb) => {
        // Tạo tên file unique: timestamp + số ngẫu nhiên + đuôi mở rộng gốc (.jpg, .png)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// Chỉ cho phép upload file ảnh
const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('File không hợp lệ! Vui lòng chỉ upload hình ảnh.'));
    }
};

export const uploadImageMiddleware = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn 5MB
});