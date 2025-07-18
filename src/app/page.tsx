// Cards
import OpenWeatherCard from "../components/cards/OpenWeatherCard";
import AccuWeatherCard from "../components/cards/AccuWeatherCard";
import OpenMeteoCard from "../components/cards/OpenMeteoCard";

// Dados
import { getOpenweatherFridayForecast } from "@/services/openweather"
import { getAccuweatherFridayForecast } from "@/services/accuweather";
import { getOpenMeteoFridayForecast } from "@/services/openmeteo";

// Formatar a data
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};


export default async function Home() {
  const { openweatherData } = await getOpenweatherFridayForecast();
  const { accuweatherData } = await getAccuweatherFridayForecast();
  const { openMeteoData } = await getOpenMeteoFridayForecast();
  console.log("Dados do openMeteoData:", openMeteoData);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center mt-6">Farmatempo</h1>
        <h2 className="text-xl text-gray-600 mb-8 text-center">Previsão do tempo para o vôlei de farmácia
          {accuweatherData && <span> {formatDate(accuweatherData.date)}</span>}</h2>

        {/* Grid com breakpoint xxl */}
        <div className="grid grid-cols-1 xxl:grid-cols-2 gap-4 w-full max-w-11/12">
          {openweatherData && <OpenWeatherCard weatherData={openweatherData} className={"col-span-2"} />}
          {openMeteoData && <OpenMeteoCard data={openMeteoData} className={"col-span-2"} />}
          {accuweatherData && <AccuWeatherCard data={accuweatherData} className={"col-span-2"} />}
        </div>
      </div>

      <div className="p-4 text-center">

      </div>
    </div>
  );
}