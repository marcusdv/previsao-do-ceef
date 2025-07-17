import Image from "next/image";
import Link from "next/link";

// Cards
import WeatherCard from "@/components/openWeatherCard";
import { AccuweatherCard } from "@/components/accuweatherCard";

// Dados
import { getOpenweatherFridayForecast } from "@/services/openweather"
import { getAccuweatherFridayForecast } from "@/services/accuweather";

export default async function Home() {
  const { openweatherData } = await getOpenweatherFridayForecast();
  const { accuweatherData } = await getAccuweatherFridayForecast();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center">
               <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center mt-4">Farmatempo</h1>
        <h2 className="text-xl text-gray-600 mb-8 text-center">Previsão do tempo para o vôlei de farmácia</h2>

        {/* Grid com breakpoint xxl */}
        <div className="grid grid-cols-1 xxl:grid-cols-2 gap-4 w-full max-w-11/12">
          <WeatherCard weatherData={openweatherData} className={"col-span-2"}/>
          {accuweatherData && <AccuweatherCard data={accuweatherData} className={"col-span-2"} />}
        </div>
      </div>

      <div className="p-4 text-center">
        <Link
          className="flex items-center justify-center gap-2 hover:underline hover:underline-offset-4"
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
    </div>
  );
}