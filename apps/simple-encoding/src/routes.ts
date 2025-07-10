import express, { Request, Response } from 'express';
import { encode } from './encode';
import { generatePresignedUrl } from './aws';
export const router = express.Router();

// Expected request body
interface EncodeRequestBody {
  inputPath: string;
}

// Expected success response
interface EncodeSuccessResponse {
  encodingId: string;
}

// Expected error response
interface ErrorResponse {
  error: string;
}

router.post(
  '/encode',
  async (
    req: Request<
      Record<string, never>,
      EncodeSuccessResponse | ErrorResponse,
      EncodeRequestBody
    >,
    res: Response<any>
  ) => {
    const { inputPath } = req.body;

    if (!inputPath || typeof inputPath !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid inputPath' });
    }

    try {
      const result = await encode(inputPath);
      return res.status(200).json(result);
    } catch (err) {
      console.error('❌ Encoding failed:', err);
      return res.status(500).json({ error: 'Failed to start encoding' });
    }
  }
);

router.get('/presign', async (req, res) => {
  const filename = req.query.filename;

  if (!filename || typeof filename !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid filename' });
  }

  try {
    const data = await generatePresignedUrl({ filename });
    return res.json(data); // { url: "...", key: "uploads/video.mp4" }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to generate presigned URL' });
  }
});
