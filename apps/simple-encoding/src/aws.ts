import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
interface GenerateUrlParams {
  filename: string;
  expiresIn?: number;
}

interface PresignResult {
  url: string;
  key: string;
}
const SECRET_KEY = process.env.AWS_SECRET_KEY!;
const ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const BUCKET = process.env.AWS_INPUT_BUCKET!;
const REGION = process.env.AWS_REGION;
if (!BUCKET || !REGION || !SECRET_KEY || !ACCESS_KEY)
  throw new Error('S3_BUCKET env var is required');

// Initialize once
const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

// AWS credentials via environment or IAM role

export async function generatePresignedUrl({
  filename,
  expiresIn = 900, // default 15 minutes
}: GenerateUrlParams): Promise<PresignResult> {
  const key = `${filename}`;
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: getContentType(filename),
  });

  const url = await getSignedUrl(s3, command, { expiresIn });
  return { url, key };
}

function getContentType(filename: string): string {
  return filename.toLowerCase().endsWith('.mov')
    ? 'video/quicktime'
    : 'video/mp4';
}
