import dynamic from 'next/dynamic';
import Image from 'next/image';
import { TravelLogs } from '@/models/TravelLog/TravelLogs';
import LoadingSpinner from '@/components/LoadingSpinner';
import TravelLogProvider from '@/TravelLogProvider';
import TravelLogSidebar from '@/components/TravelLogSidebar';
import { TravelLogEntryWithId } from '@/models/TravelLog/TravelLog';

const TravelLogMap = dynamic(() => import('@/components/TravelLogMap'), {
  ssr: false,
  loading: LoadingSpinner,
});

export default async function Home() {
  const logs = await TravelLogs.aggregate<TravelLogEntryWithId>([
    { $addFields: { _id: { $toString: '$_id' } } },
  ]).toArray();

  return (
    <main className="w-full h-full">
      <h1 className="font-bold text-xl text-center"></h1>
      <TravelLogProvider>
        <div className="bg-slate-600 text-gray-100 text-center h-[65px] pt-[10px]">
          <div>Forest Lake's Park</div>
          <div>Map Tracker</div>
        </div>
        <TravelLogMap logs={logs} />

        <TravelLogSidebar />
      </TravelLogProvider>
    </main>
  );
}
