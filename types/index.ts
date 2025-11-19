export type FileItem = {
  name: string;
  path: string;
  type: 'file';
};

export type YearData = {
  year: string;
  files: FileItem[];
};

export type ExamTypeData = {
  type: string; // DSE, CE, AL, PP, SP, BYTOPIC
  years: YearData[];
};

export type SubjectData = {
  name: string;
  english?: ExamTypeData[];
  chinese?: ExamTypeData[];
};

// Keep the old type for compatibility if needed, or remove it.
// I'll keep basic types for internal use if required.
