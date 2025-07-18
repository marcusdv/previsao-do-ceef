import { AccuWeatherDataType } from "@/types/accuweatherType";

interface Props {
    data: AccuWeatherDataType | null; // Permite que os dados sejam nulos
    className?: string; // Permite passar uma classe CSS opcional
}

export default function AccuWeatherCard({ data, className }: Props) {
    if (!data) {
        return (
            <div className={`bg-white rounded-lg shadow-lg p-6 border border-gray-200 ${className}`}>
                <h3 className="text-xl font-bold text-gray-800">AccuWeather</h3>
                <p>Dados não disponíveis</p>
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



    return (
        <div className={`bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300 ${className}`}>
            {/* Header do Card */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">AccuWeather</h3>
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                    API Premium
                </div>
            </div>

            {/* Temperaturas */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Temperatura Real */}
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Temperatura</h4>
                    <p className="text-2xl font-bold text-blue-600">
                        {Math.round((temperature.max + temperature.min) / 2)}°C
                    </p>
                    <p className="text-xs text-gray-500">
                        {temperature.min}° - {temperature.max}°
                    </p>
                </div>

                {/* Sensação Térmica */}
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Sensação</h4>
                    <p className="text-2xl font-bold text-orange-600">
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
                <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-gray-800 flex items-center">
                            ☀️ Dia
                        </h5>
                        <span className="text-sm text-gray-600">
                            {day.precipitationProbability}% chuva
                        </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{day.longPhrase}</p>
                    <div className="flex justify-between text-xs text-gray-600">
                        <span>💨 {day.wind.speed} Km/h {translateCardinalDirection(day.wind.direction)}</span>
                        <span>⛈️ {day.thunderstormProbability}% trovoada</span>
                    </div>
                </div>

                {/* Noite */}
                <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-gray-800 flex items-center">
                            🌙 Noite
                        </h5>
                        <span className="text-sm text-gray-600">
                            {night.precipitationProbability}% chuva
                        </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{night.longPhrase}</p>
                    <div className="flex justify-between text-xs text-gray-600">
                        <span>💨 {night.wind.speed} Km/h {translateCardinalDirection(night.wind.direction)}</span>
                        <span>⛈️ {night.thunderstormProbability}% trovoada</span>
                    </div>
                </div>
            </div>

            {/* Sol e Lua */}
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                {/* Sol */}
                {sun && (
                    <div className="text-center p-2 bg-yellow-100 rounded">
                        <p className="font-medium text-yellow-800 mb-1">☀️ Sol</p>
                        <p>🌅 Nasce {formatTime(sun.Rise)}</p>
                        <p>🌇 Se põe {formatTime(sun.Set)}</p>
                    </div>
                )}

                {/* Lua */}
                {moon && (
                    <div className="text-center p-2 bg-gray-100 rounded">
                        <p className="font-medium text-gray-800 mb-1">🌙 Lua</p>
                        <p>{moon.Rise ? `🌔 ${formatTime(moon.Rise)}` : "🌔 Não nasce ao dia"}</p>
                        <p>🌘 Se põe {formatTime(moon.Set)}</p>
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
    );
}