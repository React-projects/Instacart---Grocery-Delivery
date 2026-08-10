import express from 'express';
import auth from '../middleware/Auth.js';
import multer from 'multer';
import cloudinary from '../Config/cloudinary.js';

const uploadRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

uploadRouter.post('/', auth, upload.single('image'), async (req, res) => {
   try {
      if (!req.file) return res.status(400).json({ message: 'no image file provider' });
      const base64Image = Buffer.from(req.file.buffer).toString('base64');
      const dataUrl = `data:${req.file.mimetype};base64,${base64Image}`;
      const result = await cloudinary.uploader.upload(dataUrl, {
         folder: 'grocery-del',
         resource_type: 'auto',
      });
      res.json({ url: result.secure_url });
   } catch (error: any) {
      res.status(500).json({ message: error.message });
   }
});

export default uploadRouter;
