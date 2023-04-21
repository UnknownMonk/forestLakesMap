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

export default async function Map() {
  const logs = await TravelLogs.aggregate<TravelLogEntryWithId>([
    { $addFields: { _id: { $toString: '$_id' } } },
  ]).toArray();

  return (
    <TravelLogProvider>
      <TravelLogMap logs={logs} />
      <TravelLogSidebar />
    </TravelLogProvider>
  );
}
