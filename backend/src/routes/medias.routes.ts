// File: src/routes/medias.routes.ts
import { Router } from 'express';
import { uploadImageController } from '../controllers/medias.controllers';
import { uploadImageMiddleware } from '../middlewares/medias.middlewares';
import { wrapRequestHandler } from '../utils/handlers';

const mediasRouter = Router();

// Route: POST /medias/upload-image
// Khóa 'image' trong single('image') chính là key (tên trường) bạn sẽ dùng bên Postman/Frontend
mediasRouter.post(
    '/upload-image',
    uploadImageMiddleware.single('image'),
    wrapRequestHandler(uploadImageController)
);

export default mediasRouter;