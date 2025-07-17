import { OpenWeatherDataType } from "@/types/openWeatherType"

/**
 * Componente que exibe um cartão de informações meteorológicas.
 *
 * @param weatherData - Array de objetos do tipo `OpenWeatherDataType` contendo os dados meteorológicos.
 * @returns Um elemento JSX que renderiza os dados meteorológicos em cards bonitos.
 */
export default function WeatherCard({ weatherData, className }: { weatherData: OpenWeatherDataType[], className?: string }) {
    const getWeatherIcon = (description: string) => {
        const desc = description.toLowerCase();
        if (desc.includes('chuva') || desc.includes('chuvisco')) return '🌧️';
        if (desc.includes('nuvem') || desc.includes('nublado')) return '☁️';
        if (desc.includes('sol') || desc.includes('limpo')) return '☀️';
        if (desc.includes('neve')) return '❄️';
        if (desc.includes('tempestade')) return '⛈️';
        return '🌤️';
    };

    const formatTime = (dateTime: string) => {
        // Extrai apenas o horário do formato "18/07/2025, 03:00:00"
        const timePart = dateTime.split(', ')[1]; // Pega a parte após a vírgula
        return timePart ? timePart.substring(0, 5) : '00:00'; // Pega apenas HH:MM
    };

    return (
        <div className={`bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg p-6 border border-blue-200 lg:max-w-fit mx-auto min-w-full ${className}`}>
            {/* Grid de horários */}
            <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
                {weatherData.map((data, index) => (
                    <div
                        key={index}
                        className="flex flex-col justify-around bg-white/70 rounded-lg p-4 text-center hover:bg-white/90 transition-all duration-200 border border-white/50 overflow-hidden"
                    >
                        {/* Horário */}
                        <div className="mb-3">
                            <h3 className="text-lg font-semibold text-gray-700">
                                {formatTime(data.dataHora)}
                            </h3>
                        </div>

                        {/* Ícone e temperatura */}
                        <div className="mb-4">
                            <div className="text-3xl mb-2">
                                {getWeatherIcon(data.descricao)}
                            </div>
                            <div className="text-xl font-bold text-gray-800">
                                {data.temperatura}°C
                            </div>
                        </div>

                        {/* Descrição */}
                        <p className="text-xs text-gray-600 capitalize mb-3 leading-tight">
                            {data.descricao}
                        </p>

                        {/* Detalhes */}
                        <div className="space-y-1">
                            {data.probabilidadeChuva !== null && (
                                <div className="text-xs ">
                                    <span className="text-blue-600 whitespace-nowrap">💧 {data.probabilidadeChuva}%</span>
                                </div>
                            )}

                            {data.velocidadeVento !== null && (
                                <div className="text-xs">
                                    <span className="text-green-600 whitespace-nowrap ">💨 {data.velocidadeVento} km/h</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* fonte dos dados */}
            <div className="text-right mt-4">
                <p className="text-sm text-gray-600">Fonte: {weatherData[0]?.fonte}</p>
            </div>
        </div>
    )
}