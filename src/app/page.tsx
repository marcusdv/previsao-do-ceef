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
 * Função utilitária para formatar datas no padrão brasileiro
 * @param dateString - String de data no formato ISO ou similar
 * @returns Data formatada como DD/MM/AAAA
 */
/**
 * Componente principal da página Home
 * 
 * Responsabilidades:
 * - Buscar dados meteorológicos de 3 fontes diferentes (OpenWeather, AccuWeather, OpenMeteo)
 * - Renderizar cards com previsões para sexta-feira
 * - Tratar falhas de API de forma resiliente 
 * 
 * Estratégia de resiliência:
 * - Usa Promise.allSettled para que falha em uma API não impeça as outras
 * - Renderização condicional: só mostra cards para APIs que retornaram dados
 * - Server-side rendering com cache inteligente dos serviços
 */

export default function Home() {
  // como as apis classificam os dias da semana
  const days: { [key: string]: number } = { 'sexta': 5, 'sábado': 6 };

  // dia padrão é sexta
  const [dayOfWeek, setDayOfWeek] = useState<string>('sexta');
  const [data, setData] = useState<{
    accuweatherData: AccuWeatherDataType | null;
    openMeteoData: OpenMeteoDataType[] | null;
  }>({
    accuweatherData: null, openMeteoData: null
  })

  // Promise.allSettled garante que se uma API falhar, as outras continuam funcionando
  // Isso evita que o build quebre se uma API estiver instável


  // Extrai dados das APIs que tiveram sucesso, define null para as que falharam
  // Isso permite renderização parcial mesmo se algumas APIs estiverem indisponíveis

  useEffect(() => {
    const fetchData = async () => {

      const [accuweatherResult, openmeteoResult] = await Promise.allSettled([
        getAccuweatherFridayForecast(),
        getOpenMeteoFridayForecast(days[dayOfWeek])

      ]);

      setData({
        accuweatherData: accuweatherResult.status === 'fulfilled' ? accuweatherResult.value.accuweatherData : null,
        openMeteoData: openmeteoResult.status === 'fulfilled' ? openmeteoResult.value.openMeteoData : null
      })

    }

    fetchData();
  }, [dayOfWeek]);



  return (
    // Container principal com altura mínima da tela
    <div className="min-h-screen flex flex-col pb-10">
      <div className="flex-1 flex flex-col items-center justify-center">

        <Header dataOpenMeteo={data.openMeteoData && data.openMeteoData} dayOfWeek={dayOfWeek} setDayOfWeek={setDayOfWeek} />


        {/* col-span-2 em xxl para layout lado a lado em telas muito grandes */}
        <div className="grid grid-cols-1 xxl:grid-cols-2 gap-4 w-full max-w-11/12">

          {/* Renderização condicional: só mostra card se tiver dados */}
          {data.openMeteoData && <OpenMeteoCard data={data.openMeteoData} className={"col-span-2 "} />}
          {/* {data.openweatherData && <OpenWeatherCard data={data.openweatherData} className={"col-span-2"} />} */}
          {data.accuweatherData && <AccuWeatherCard data={data.accuweatherData} className={"col-span-2"} />}
          {/* Componente do mapa com importação dinâmica */}
          <MapaWrapper className={"col-span-2"} />
        </div>
      </div>
    </div>
  );
}