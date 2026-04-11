// File: src/controllers/medias.controllers.ts
import { Request, Response } from 'express';
import HTTP_STATUS from '../constants/httpStatus';

export const uploadImageController = async (req: Request, res: Response) => {
    // req.file sẽ được multer tự động thêm vào sau khi xử lý xong
    if (!req.file) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
            message: 'Không tìm thấy file tải lên' 
        });
    }

    const host = process.env.HOST_URL || `http://localhost:${process.env.PORT || 4000}`;
    
    // Tạo link để Frontend có thể truy cập ảnh (ví dụ: http://localhost:4000/uploads/image-1234.jpg)
    const imageUrl = `${host}/uploads/${req.file.filename}`;

    return res.status(HTTP_STATUS.OK).json({
        message: 'Upload hình ảnh thành công',
        result: imageUrl
    });
};