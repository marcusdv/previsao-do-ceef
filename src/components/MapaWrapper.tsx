'use client';
import dynamic from 'next/dynamic';
import { useState, useRef, useEffect } from 'react';

// Importação dinâmica do mapa para evitar problemas de SSR
const MapaPrevisao = dynamic(
    () => import('@/components/MapaPrevisao'),
    {
        loading: () => <div className="h-[300px] w-full bg-g</div>ray-100 rounded-xl flex items-center justify-center">
            <p className="text-gray-600">Carregando mapa...</p>
        </div>,
        ssr: false
    }
);

export default function MapaWrapper() {

    const [isExpanded, setIsExpanded] = useState(false);
    const [linhas, setLinhas] = useState<'1fr' | '0fr'>('1fr');
    const accordeonRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (accordeonRef.current) {
            accordeonRef.current.style.gridTemplateRows = linhas;
        }
    }, [linhas]);

    // Accordion para exibir os dados
    const handleAccordeonClick = () => {
        // Lógica para expandir ou recolher o acordeão
        setIsExpanded((prev) => {
            const next = !prev;
            if (accordeonRef.current) {
                setLinhas(next ? '0fr' : '1fr');
                accordeonRef.current.style.gridTemplateRows = linhas;
            }
            return next;
        });
    }

    return (
        <div
            className={`accordeon`}
            ref={accordeonRef}
        >
            <div className={`bg-gradient-to-br  cursor-pointer from-gray-50 to-slate-100 rounded-xl shadow-lg p-6 border border-slate-200 lg:max-w-fit min-w-full`}

            >
                <div
                    className="flex select-none items-center justify-between cursor-pointer mb-4"
                    onClick={handleAccordeonClick}

                >
                    <h2 className="flex text-xl font-bold text-gray-800">Local da previsão</h2>
                    <span
                        className={`text-2xl select-none text-slate-800 transition-transform duration-300 ${isExpanded ? "-rotate-180" : "rotate-0"}`}
                    >
                        ▲
                    </span>
                </div>
                <div className="overflow-hidden">
                    <MapaPrevisao />
                </div>
            </div>
        </div>
    );
}
