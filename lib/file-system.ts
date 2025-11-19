import { SubjectData } from '@/types';
import fileIndex from '@/data/file-index.json';

// This function now reads from the generated JSON file instead of the file system.
// This allows the site to be deployed on serverless platforms (Vercel) where the
// 8GB of PDF files are not present.
export function getStructuredFiles(): SubjectData[] {
  // The JSON file is already structured correctly by our generation script.
  // We can just return it directly.
  return fileIndex as SubjectData[];
}
