import config from 'config';
import multer from 'multer';

export const upload = multer({ dest: config.get(`file.uploadDir`) });
