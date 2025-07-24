'use client';
import { OpenWeatherDataType } from "@/types/openWeatherType"
import { useState } from "react";

/**
 * Componente que exibe um cartão de informações meteorológicas.
 *
 * @param weatherData - Array de objetos do tipo `OpenWeatherDataType` contendo os dados meteorológicos.
 * @returns Um elemento JSX que renderiza os dados meteorológicos em cards bonitos.
 */
export default function OpenWeatherCard({ data, className }: { data: OpenWeatherDataType[] | null, className?: string }) {
    const [isExpanded, setIsExpanded] = useState(false);


    if (!data || data.length === 0 || data.length < 6) {
        return (
            <div className={`bg-white rounded-lg  shadow-lg p-6 border border-gray-200 min-w-full ${className}`}>
                <h3 className="text-xl font-bold text-gray-800">OpenWeather</h3>
                <p>Dados não disponíveis</p>
            </div>
        );
    }


    const getWeatherIcon = (description: string, probabilidadeChuva: number | null) => {
        const desc = description.toLowerCase();

        if (probabilidadeChuva !== null && probabilidadeChuva < 51) {
            if (desc.includes('chuva')) return <i className="wi wi-day-showers text-3xl text-blue-500"></i>;
            if (desc.includes('chuvisco')) return <i className="wi wi-day-sprinkle text-3xl text-blue-400"></i>;
            if (desc.includes('nuvem') || desc.includes('nublado')) return <i className="wi wi-day-cloudy text-3xl text-blue-400"></i>;
            return <i className="wi wi-day-sunny-overcast text-3xl text-yellow-500"></i>;
        }

        if (desc.includes('chuva')) return <i className="wi wi-day-rain text-3xl text-blue-600"></i>;
        if (desc.includes('chuvisco')) return <i className="wi wi-day-sprinkle text-3xl text-blue-500"></i>;
        if (desc.includes('nuvem') || desc.includes('nublado')) return <i className="wi wi-day-cloudy text-3xl text-blue-500"></i>;
        if (desc.includes('sol') || desc.includes('limpo')) return <i className="wi wi-day-sunny text-3xl text-yellow-600"></i>;
        if (desc.includes('neve')) return <i className="wi wi-day-snow text-3xl text-blue-300"></i>;
        if (desc.includes('tempestade')) return <i className="wi wi-day-thunderstorm text-3xl text-purple-600"></i>;
        return <i className="wi wi-day-sunny-overcast text-3xl text-yellow-500"></i>;
    };

    const formatTime = (dateTime: string) => {
        // Extrai apenas o horário do formato "18/07/2025, 03:00:00"
        const timePart = dateTime.split(', ')[1]; // Pega a parte após a vírgula
        return timePart ? timePart.substring(0, 5) : '00:00'; // Pega apenas HH:MM
    };

    // Accordion para exibir os dados
    const handleAccordeonClick = (event: React.MouseEvent<HTMLDivElement>) => {
        // Lógica para expandir ou recolher o acordeão
        const accordeonElement = event.currentTarget;
        setIsExpanded((prev) => {
            const next = !prev;
            accordeonElement.style.gridTemplateRows = next ? '1fr' : '0fr';
            return next;
        });
    }

    // Renderiza o componente
    return (
        // acordeon
        <div className={`accordeon ${className ? className : ""}`} onClick={handleAccordeonClick} >
            <div className={`bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg p-6 border border-blue-200 lg:max-w-fit min-w-full`}
            >
                <div className="flex select-none items-center justify-between cursor-pointer mb-4">

                    <h2 className="flex text-xl font-bold  text-gray-800">OpenWeather</h2>
                    <span
                        className={`text-2xl select-none text-blue-800 transition-transform duration-300 ${isExpanded ? "-rotate-180" : "rotate-0"}`}
                    >
                        ▲
                    </span>

                </div>
                {/* Grid de horários */}
                <div className={`grid grid-cols-3 gap-2 md:grid-cols-${data.length} `}>
                    {data.map((inf, index) => (
                        <div
                            key={index}
                            className="flex flex-col justify-around bg-white/70 rounded-lg p-4 text-center hover:bg-white/90 transition-all duration-200 border border-white/50 overflow-hidden"
                        >
                            {/* Horário */}
                            <div className="mb-3">
                                <h3 className="text-lg font-semibold text-gray-700">
                                    {formatTime(inf.dataHora)}
                                </h3>
                            </div>

                            {/* Ícone e temperatura */}
                            <div className="mb-4">
                                <div className="text-3xl mb-2">
                                    {getWeatherIcon(inf.descricao, inf.probabilidadeChuva ?? 0)}
                                </div>
                                <div className="text-xl font-bold text-gray-800">
                                    {inf.temperatura}°C
                                </div>
                            </div>

                            {/* Descrição */}
                            <p className="text-xs text-gray-600 capitalize mb-3 leading-tight">
                                {inf.descricao}
                            </p>

                            {/* Detalhes */}
                            <div className="space-y-1">
                                {inf.probabilidadeChuva !== null && (
                                    <div className="text-xs ">
                                        <span className="text-blue-600 whitespace-nowrap">
                                            <i className="wi wi-rain mr-1"></i>
                                            {inf.probabilidadeChuva}%
                                        </span>
                                    </div>
                                )}

                                {inf.velocidadeVento !== null && (
                                    <div className="text-xs">
                                        <span className="text-green-600 whitespace-nowrap ">
                                            <i className="wi wi-strong-wind mr-1"></i>
                                            {inf.velocidadeVento} km/h
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* fonte dos dados */}
                <div className="text-right mt-4 flex justify-between">
                    <p className="text-sm text-gray-600 hidden md:block ">
                        Previsão com as coordenadas do CEEF
                    </p>
                    <p className="text-sm text-gray-600">Fonte: {data[0]?.fonte}</p>
                </div>

            </div>
        </div>

    )
}