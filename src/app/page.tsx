'use client'
// Importação dos componentes de cards que exibem dados meteorológicos
import AccuWeatherCard from "../components/cards/AccuWeatherCard";
import OpenMeteoCard from "../components/cards/OpenMeteoCard";
import MapaWrapper from "@/components/MapaWrapper";

// Serviços para buscar dados das APIs meteorológicas
import { getAccuweatherFridayForecast } from "@/services/accuweather";
import { getOpenMeteoFridayForecast, OpenMeteoDataType } from "@/services/openmeteo";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { AccuWeatherDataType } from "@/types/accuweatherType";

/**
 * Componente principal da página Home
 * 
 * Responsabilidades:
 * - Buscar dados meteorológicos de 2 fontes diferentes (AccuWeather, OpenMeteo)
 * - Renderizar cards com previsões para sexta-feira ou sábado
 * - Tratar falhas de API de forma resiliente 
 * 
 * Estratégia de resiliência:
 * - Usa Promise.allSettled para que falha em uma API não impeça as outras
 * - Renderização condicional: só mostra cards para APIs que retornaram dados
 */

// Mapeamento de dias da semana (como as APIs classificam)
const DAYS_MAP: { [key: string]: number } = { 'sexta': 5, 'sábado': 6 };

export default function Home() {

  // Estado do dia da semana (default: sexta)
  const [dayOfWeek, setDayOfWeek] = useState<string>('sexta');
  
  // Estado para armazenar dados das APIs
  const [data, setData] = useState<{
    accuweatherData: AccuWeatherDataType | null;
    openMeteoData: OpenMeteoDataType[] | null;
  }>({
    accuweatherData: null, 
    openMeteoData: null
  });

  // useEffect que busca dados sempre que o dia da semana mudar
  useEffect(() => {
    const fetchData = async () => {
      
      // Promise.allSettled garante que se uma API falhar, as outras continuam funcionando
      const [accuweatherResult, openmeteoResult] = await Promise.allSettled([
        getAccuweatherFridayForecast(DAYS_MAP[dayOfWeek]), // Passa o dia (5 ou 6)
        getOpenMeteoFridayForecast(DAYS_MAP[dayOfWeek])    // Passa o dia (5 ou 6)
      ]);

      // Extrai dados das APIs que tiveram sucesso, define null para as que falharam
      setData({
        accuweatherData: accuweatherResult.status === 'fulfilled' ? accuweatherResult.value.accuweatherData : null,
        openMeteoData: openmeteoResult.status === 'fulfilled' ? openmeteoResult.value.openMeteoData : null
      });
    };

    fetchData();
  }, [dayOfWeek]); // Re-executa quando dayOfWeek mudar

  return (
    // Container principal com altura mínima da tela
    <div className="min-h-screen flex flex-col pb-10">
      <div className="flex-1 flex flex-col items-center justify-center">

        {/* Header com toggle sexta/sábado */}
        <Header 
          dataOpenMeteo={data.openMeteoData} 
          dayOfWeek={dayOfWeek} 
          setDayOfWeek={setDayOfWeek} 
        />

        {/* Grid com cards de previsão */}
        <div className="grid grid-cols-1 xxl:grid-cols-2 gap-4 w-full max-w-11/12">
          
          {/* Renderização condicional: só mostra card se tiver dados */}
          {data.openMeteoData && <OpenMeteoCard data={data.openMeteoData} className={"col-span-2"} />}
          {data.accuweatherData && <AccuWeatherCard data={data.accuweatherData} className={"col-span-2"} />}
          
          {/* Componente do mapa */}
          <MapaWrapper className={"col-span-2"} />
        </div>
      </div>
    </div>
  );
}