import { VideoContainer } from './container';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function MoviePage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="flex flex-col min-h-screen">
      <VideoContainer movieId={id} />
    </div>
  );
}
