import { AccuWeatherDataType } from "@/types/AccuWeatherType";

interface AccuweatherCardProps {
  data: AccuWeatherDataType;
  className?: string;
}

export default function AccuweatherCard({ data, className }: AccuweatherCardProps) {
  if (!data) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <h3 className="text-lg font-semibold mb-4">AccuWeather</h3>
        <p>Dados não disponíveis</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">AccuWeather</h3>
      
      <div className="grid gap-4">
        <div className="text-center">
          <h4 className="font-semibold text-lg mb-2">Temperatura</h4>
          <div className="flex justify-center gap-4">
            <span className="text-2xl font-bold text-red-500">{data.temperature.max}°C</span>
            <span className="text-2xl font-bold text-blue-500">{data.temperature.min}°C</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h5 className="font-semibold mb-2">🌅 Dia</h5>
            <p className="text-sm mb-2">{data.day.longPhrase}</p>
            <div className="text-sm text-gray-600">
              <p>🌧️ Chuva: {data.day.precipitationProbability}%</p>
              <p>⚡ Trovoada: {data.day.thunderstormProbability}%</p>
              <p>💨 Vento: {data.day.wind.speed} km/h ({data.day.wind.direction})</p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-semibold mb-2">🌙 Noite</h5>
            <p className="text-sm mb-2">{data.night.longPhrase}</p>
            <div className="text-sm text-gray-600">
              <p>🌧️ Chuva: {data.night.precipitationProbability}%</p>
              <p>⚡ Trovoada: {data.night.thunderstormProbability}%</p>
              <p>💨 Vento: {data.night.wind.speed} km/h ({data.night.wind.direction})</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}