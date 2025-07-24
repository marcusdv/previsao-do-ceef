'use client';
import dynamic from 'next/dynamic';

// Importação dinâmica do mapa para evitar problemas de SSR
const MapaPrevisao = dynamic(
  () => import('@/components/MapaPrevisao'),
  { 
    loading: () => <div className="h-[300px] w-full bg-gray-100 rounded-xl flex items-center justify-center">
      <p className="text-gray-600">Carregando mapa...</p>
    </div>,
    ssr: false
  }
);

export default function MapaWrapper() {
  return <MapaPrevisao />;
}
