'use client'
import { AccuWeatherDataType } from "@/types/accuweatherType";
import { useState } from "react";
import AccordeonWrapper from "../AccordeonWrapper";

interface Props {
    data: AccuWeatherDataType | null; // Permite que os dados sejam nulos
    className?: string; // Permite passar uma classe CSS opcional
}

export default function AccuWeatherCard({ data, className }: Props) {
    const [isExpanded, setIsExpanded] = useState(true);

    if (!data) {
        return (
            <div className={`bg-gradient-to-br from-emerald-50 to-teal-100 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 ${className}`}>

                {/* Header do Card */}
                <div className="flex cursor-pointer select-none items-center justify-between ">
                    <h3 className="text-xl font-bold text-gray-800">AccuWeather</h3>
                </div>
                <div className="w-fit my-2">
                    <p className="w-fit text-gray-500">Dados não encontrados :(</p>
                </div>
            </div>
        );
    }

    const { temperature, realFeelTemperature, day, night, sun, moon } = data;


    // Formatar a data
    // const formatDate = (dateString: string) => {
    //     return new Date(dateString).toLocaleDateString("pt-BR", {
    //         weekday: "long",
    //         day: "2-digit",
    //         month: "2-digit",
    //         year: "numeric",
    //     });
    // };

    // Formatar horários
    const formatTime = (timeString: string) => {
        return new Date(timeString).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Fases da Lua traduzidas
    const translateMoonPhase = (phase: string) => {
        const phases: { [key: string]: string } = {
            'NewMoon': 'Nova',
            'WaxingCrescent': 'Crescente',
            'First': 'Quarto Crescente',
            'WaxingGibbous': 'Gibosa Crescente',
            'Full': 'Cheia',
            'WaningGibbous': 'Gibosa Minguante',
            'Last': 'Quarto Minguante',
            'WaningCrescent': 'Minguante',
        };

        return phases[phase] || phase;
    };

    const translateCardinalDirection = (direction: string) => {
        const directionOBJ: { [key: string]: string } = {
            'N': 'Norte',
            'NE': 'Nordeste',
            'E': 'Leste',
            'SE': 'Sudeste',
            'S': 'Sul',
            'SW': 'Sudoeste',
            'W': 'Oeste',
            'NW': 'Noroeste'
        }
        return directionOBJ[direction] || direction;
    }

    const headerContent = (isExpanded: boolean) => (
        <div className={`flex justify-between  pb-6 hover:shadow-xl transition-all duration-300 ${className}`}>
            <h3 className="text-xl font-bold text-gray-800">AccuWeather</h3>
            <span
                className={`cursor-pointer text-2xl select-none text-green-800 transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"
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
            contentClassName="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
        >
            <div className={`bg-gradient-to-br from-emerald-50 to-teal-100 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300`}>

                {/* Temperaturas */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Temperatura Real */}
                    <div className="text-center p-3 bg-cyan-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-600 mb-1">Temperatura</h4>
                        <p className="text-2xl font-bold text-cyan-600">
                            {Math.round((temperature.max + temperature.min) / 2)}°C
                        </p>
                        <p className="text-xs text-gray-500">
                            {temperature.min}° - {temperature.max}°
                        </p>
                    </div>

                    {/* Sensação Térmica */}
                    <div className="text-center p-3 bg-teal-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-600 mb-1">Sensação</h4>
                        <p className="text-2xl font-bold text-teal-600">
                            {Math.round((realFeelTemperature.max + realFeelTemperature.min) / 2)}°C
                        </p>
                        <p className="text-xs text-gray-500">
                            {realFeelTemperature.min}° - {realFeelTemperature.max}°
                        </p>
                    </div>
                </div>

                {/* Previsão Dia e Noite */}
                <div className="space-y-4 mb-6">
                    {/* Dia */}
                    <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-gray-800 flex items-center">
                                <i className="wi wi-day-sunny text-orange-600 mr-1"></i>
                                Dia
                            </h5>
                            <span className="text-sm text-gray-600">
                                {day.precipitationProbability}% chuva
                            </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{day.longPhrase}</p>
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>
                                <i className="wi wi-strong-wind mr-1"></i>
                                {day.wind.speed} Km/h {translateCardinalDirection(day.wind.direction)}
                            </span>
                            <span>
                                <i className="wi wi-thunderstorm mr-1"></i>
                                {day.thunderstormProbability}% trovoada
                            </span>
                        </div>
                    </div>

                    {/* Noite */}
                    <div className="bg-indigo-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-gray-800 flex items-center">
                                <i className="wi wi-night-clear text-indigo-600 mr-1"></i>
                                Noite
                            </h5>
                            <span className="text-sm text-gray-600">
                                {night.precipitationProbability}% chuva
                            </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{night.longPhrase}</p>
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>
                                <i className="wi wi-strong-wind mr-1"></i>
                                {night.wind.speed} Km/h {translateCardinalDirection(night.wind.direction)}
                            </span>
                            <span>
                                <i className="wi wi-thunderstorm mr-1"></i>
                                {night.thunderstormProbability}% trovoada
                            </span>
                        </div>
                    </div>
                </div>

                {/* Sol e Lua */}
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                    {/* Sol */}
                    {sun && (
                        <div className="text-center p-2 bg-yellow-100 rounded">
                            <p className="font-medium text-yellow-800 mb-1 flex items-center justify-center">
                                <i className="wi wi-day-sunny text-yellow-600 mr-1"></i>
                                Sol
                            </p>
                            <p>
                                <i className="wi wi-sunrise mr-1"></i>
                                Nasce {formatTime(sun.Rise)}
                            </p>
                            <p>
                                <i className="wi wi-sunset mr-1"></i>
                                Se põe {formatTime(sun.Set)}
                            </p>
                        </div>
                    )}

                    {/* Lua */}
                    {moon && (
                        <div className="text-center p-2 bg-slate-100 rounded">
                            <p className="font-medium text-slate-800 mb-1 flex items-center justify-center">
                                <i className="wi wi-night-clear text-slate-600 mr-1"></i>
                                Lua
                            </p>
                            <p>
                                {moon.Rise ? (
                                    <>
                                        <i className="wi wi-moonrise mr-1"></i>
                                        {formatTime(moon.Rise)}
                                    </>
                                ) : (
                                    <>
                                        <i className="wi wi-moonrise mr-1"></i>
                                        Não nasce ao dia
                                    </>
                                )}
                            </p>
                            <p>
                                <i className="wi wi-moonset mr-1"></i>
                                Se põe {formatTime(moon.Set)}
                            </p>
                            <p className="text-xs">{translateMoonPhase(moon.Phase)} ({moon.Age} dias)</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-600 text-right">
                        Fonte: AccuWeather API
                    </p>
                </div>
            </div>
        </AccordeonWrapper>
    );
}