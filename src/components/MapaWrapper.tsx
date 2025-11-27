'use client';
import dynamic from 'next/dynamic';
import AccordeonWrapper from './AccordeonWrapper';

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

export default function MapaWrapper({className = ""}: {className: string}) {

    const headerContent = (isExpanded: boolean) => (
        <div className={`flex justify-between rounded-xl pb-6`}>
            <h3 className="text-xl font-bold text-gray-800">Local da previsão</h3>
            <span
                className={`cursor-pointer text-2xl select-none text-slate-800  transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"
                    }`}
            >
                ▲
            </span>
        </div>
    );

    return (
        <AccordeonWrapper
            header={headerContent}
            initialExpanded={true}
            className={className}
            contentClassName="bg-gradient-to-br  cursor-pointer from-gray-50 to-slate-100 rounded-xl shadow-lg p-6 border border-slate-200 lg:max-w-fit min-w-full"
        >
            <div className={`bg-gradient-to-br from-gray-50 via-slate-50 to-indigo-50-50 border border-slate-200/50 rounded-xl shadow-lg p-6`}>
                <MapaPrevisao />
            </div>
        </AccordeonWrapper>
    );
    
}
