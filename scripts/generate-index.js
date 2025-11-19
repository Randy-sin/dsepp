const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '../public/dse_past_papers');
const OUTPUT_FILE = path.join(__dirname, '../data/file-index.json');
// 从环境变量读取 CDN 地址，如果没有则使用本地路径（开发模式）
const CDN_PREFIX = process.env.CDN_URL || 'https://pub-bff98d8c588c415787d802617e94efc7.r2.dev';

const SUBJECT_ORDER = [
  '中國語文',
  '英國語文',
  '數學',
  '數學延伸單元一',
  '數學延伸單元二',
  '通識教育',
  '物理',
  '化學',
  '生物',
  '經濟',
  '企業、會計與財務概論',
  '中國歷史',
  '歷史',
  '地理',
  '資訊及通訊科技',
  '旅遊與款待'
];

function getFiles(dirPath, relativePath) {
  if (!fs.existsSync(dirPath)) return [];
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  return items
    .filter(item => item.isFile() && !item.name.startsWith('.'))
    .map(item => ({
      name: item.name,
      // 生成最终的下载链接，而不是本地路径
      path: `${CDN_PREFIX}${relativePath}/${encodeURIComponent(item.name)}`, 
      type: 'file'
    }))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
}

function getYears(dirPath, relativePath) {
  if (!fs.existsSync(dirPath)) return [];
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  
  const years = [];

  // Direct files in folder
  const directFiles = getFiles(dirPath, relativePath);
  if (directFiles.length > 0) {
      years.push({
          year: 'Misc',
          files: directFiles
      });
  }

  items.forEach(item => {
    if (item.isDirectory() && !item.name.startsWith('.')) {
      const yearPath = path.join(dirPath, item.name);
      const yearRelPath = `${relativePath}/${item.name}`;
      const files = getFiles(yearPath, yearRelPath);
      
      if (files.length > 0) {
        years.push({
          year: item.name,
          files: files
        });
      }
    }
  });

  return years.sort((a, b) => {
      const aNum = parseInt(a.year);
      const bNum = parseInt(b.year);
      if (!isNaN(aNum) && !isNaN(bNum)) return bNum - aNum;
      return a.year.localeCompare(b.year);
  });
}

function getExamTypes(dirPath, relativePath) {
  if (!fs.existsSync(dirPath)) return [];
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  
  const exams = [];
  
  items.forEach(item => {
    if (item.isDirectory() && !item.name.startsWith('.')) {
      const examPath = path.join(dirPath, item.name);
      const examRelPath = `${relativePath}/${item.name}`;
      const years = getYears(examPath, examRelPath);
      
      if (years.length > 0) {
        exams.push({
          type: item.name,
          years: years
        });
      }
    }
  });

  const priority = ['DSE', 'PP', 'SP', 'CE', 'AL'];
  return exams.sort((a, b) => {
      const idxA = priority.indexOf(a.type);
      const idxB = priority.indexOf(b.type);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.type.localeCompare(b.type);
  });
}

function generateIndex() {
  console.log('Scanning files...');
  try {
    if (!fs.existsSync(BASE_DIR)) {
        console.error('Directory not found:', BASE_DIR);
        return;
    }
    
    const subjects = fs.readdirSync(BASE_DIR, { withFileTypes: true })
      .filter(item => item.isDirectory() && !item.name.startsWith('.'));

    const data = subjects.map(subject => {
      const subjectPath = path.join(BASE_DIR, subject.name);
      const subjectRelPath = `/dse_past_papers/${subject.name}`;
      
      const subItems = fs.readdirSync(subjectPath, { withFileTypes: true });
      
      let chinesePath = '';
      let englishPath = '';

      subItems.forEach(sub => {
          if (!sub.isDirectory()) return;
          const lower = sub.name.toLowerCase();
          if (['中文', 'chinese', 'chi'].includes(lower)) {
              chinesePath = sub.name;
          } else if (['英文', 'english', 'eng', 'eng.'].includes(lower)) {
              englishPath = sub.name;
          }
      });

      const chineseData = chinesePath ? getExamTypes(path.join(subjectPath, chinesePath), `${subjectRelPath}/${chinesePath}`) : undefined;
      const englishData = englishPath ? getExamTypes(path.join(subjectPath, englishPath), `${subjectRelPath}/${englishPath}`) : undefined;

      return {
        name: subject.name,
        chinese: chineseData,
        english: englishData
      };
    }).sort((a, b) => {
      const idxA = SUBJECT_ORDER.indexOf(a.name);
      const idxB = SUBJECT_ORDER.indexOf(b.name);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.name.localeCompare(b.name);
    });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
    console.log(`Index generated successfully at ${OUTPUT_FILE}`);
    console.log('Total subjects:', data.length);

  } catch (error) {
    console.error("Error scanning DSE files:", error);
  }
}

generateIndex();

