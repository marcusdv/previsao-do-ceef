import Image from "next/image";
import Link from "next/link";
import { getOpenweatherFridayForecast } from "@/services/openweather"
import WeatherCard from "@/components/weatherCard";


export default async function Home() {
  const { openweatherData } = await getOpenweatherFridayForecast();

  console.log("Previsão de sexta-feira:", openweatherData);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center mt-4">Previsão para Sexta-feira</h2>
        <div className="grid grid-cols-2 gap-4">
          <WeatherCard weatherData={openweatherData} />
          <WeatherCard weatherData={openweatherData} />
          <WeatherCard weatherData={openweatherData} />
          <WeatherCard weatherData={[]} />
          <WeatherCard weatherData={openweatherData} />
          <WeatherCard weatherData={openweatherData} />
        </div>
      </div>
      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="/sobre"
      >
        <Image
          aria-hidden
          src="/file.svg"
          alt="File icon"
          width={16}
          height={16}
        />
        Sobre
      </Link>
    </div>
  );
}
