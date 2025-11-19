import { getStructuredFiles } from '@/lib/file-system';
import DseBrowser from '@/components/DseBrowser';

export default function App() {
  const subjects = getStructuredFiles();

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <DseBrowser subjects={subjects} />
    </main>
  );
}

