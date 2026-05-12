import "dotenv/config";
import { Storage } from "@google-cloud/storage";

const bucketName = process.env.GCS_BUCKET_NAME;
if (!bucketName) {
  throw new Error("GCS_BUCKET_NAME is not set");
}

const projectId = process.env.GCP_PROJECT_ID;
const clientEmail = process.env.GCP_SERVICE_ACCOUNT_EMAIL;
const privateKey = process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n");
const privateKeyId = process.env.GCP_PRIVATE_KEY_ID;
const clientId = process.env.GCP_CLIENT_ID;

if (!projectId || !clientEmail || !privateKey) {
  throw new Error(
    "Missing GCP credentials: GCP_PROJECT_ID, GCP_SERVICE_ACCOUNT_EMAIL, and GCP_PRIVATE_KEY are required"
  );
}

const storage = new Storage({
  projectId,
  credentials: {
    client_email: clientEmail,
    private_key: privateKey,
    private_key_id: privateKeyId,
    client_id: clientId,
    type: "service_account",
  },
});

export const bucket = storage.bucket(bucketName);

export async function uploadBuffer(
  objectName: string,
  buffer: Buffer,
  contentType: string
) {
  const file = bucket.file(objectName);
  await file.save(buffer, {
    contentType,
    resumable: false,
  });
  return `gs://${bucketName}/${objectName}`;
}

export async function downloadBuffer(objectName: string): Promise<Buffer> {
  const [contents] = await bucket.file(objectName).download();
  return contents;
}

export function createReadStream(objectName: string) {
  return bucket.file(objectName).createReadStream();
}

export async function deleteObject(objectName: string) {
  await bucket.file(objectName).delete({ ignoreNotFound: true });
}
