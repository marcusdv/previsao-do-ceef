// API Route que roda no servidor Next.js para fazer proxy das requisições AccuWeather
// Isso evita problemas de CORS e mantém a API key segura (não exposta no cliente)

import { NextResponse } from 'next/server';
import { AccuWeatherDataType } from '@/types/accuweatherType';
import shouldMakeApiRequest from '@/utils/shouldMakeApiRequest';
import { addLog } from '@/app/api/logs/route';

export async function GET() {
  const { cacheTime } = shouldMakeApiRequest();
  
  const apiKey = process.env.ACCUWEATHER_API_KEY;

  if (!apiKey) {
    addLog('error', '[AccuWeather] API Key não encontrada');
    return NextResponse.json({ error: 'API Key não encontrada' }, { status: 500 });
  }

  const url = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/43080?apikey=${apiKey}&language=pt-br&metric=false&details=true`;

  try {
    const response = await fetch(url, {
      next: { revalidate: cacheTime },
    });

    addLog('info', '[AccuWeather] Response status', { status: response.status });

    if (response.status === 401) {
      addLog('error', '[AccuWeather] API Key inválida');
      return NextResponse.json({ error: 'API Key inválida' }, { status: 401 });
    }

    if (response.status === 429) {
      addLog('warning', '[AccuWeather] Limite da API excedido');
      return NextResponse.json({ error: 'Limite da API excedido' }, { status: 429 });
    }

    if (!response.ok) {
      const errorText = await response.text();
      addLog('error', '[AccuWeather] Erro na API', { status: response.status, error: errorText });
      return NextResponse.json({ error: 'Erro na API' }, { status: response.status });
    }

    const data = await response.json();

    const friday = data.DailyForecasts.find((d: { Date: string }) => {
      const date = new Date(d.Date);
      return date.getDay() === 5;
    });

    if (!friday) {
      return NextResponse.json({ accuweatherData: null });
    }

    const accuweatherData: AccuWeatherDataType = {
      date: friday.Date,
      temperature: {
        max: friday.Temperature.Maximum.Value,
        min: friday.Temperature.Minimum.Value,
      },
      realFeelTemperature: {
        max: friday.RealFeelTemperature.Maximum.Value,
        min: friday.RealFeelTemperature.Minimum.Value,
      },
      day: {
        hasPrecipitation: friday.Day.HasPrecipitation,
        longPhrase: friday.Day.LongPhrase,
        precipitationProbability: friday.Day.PrecipitationProbability,
        thunderstormProbability: friday.Day.ThunderstormProbability,
        wind: {
          speed: friday.Day.Wind.Speed.Value,
          direction: friday.Day.Wind.Direction.English,
        },
      },
      night: {
        hasPrecipitation: friday.Night.HasPrecipitation,
        longPhrase: friday.Night.LongPhrase,
        precipitationProbability: friday.Night.PrecipitationProbability,
        thunderstormProbability: friday.Night.ThunderstormProbability,
        wind: {
          speed: friday.Night.Wind.Speed.Value,
          direction: friday.Night.Wind.Direction.English,
        },
      },
      sun: {
        Rise: friday.Sun.Rise,
        Set: friday.Sun.Set,
      },
      moon: {
        Rise: friday.Moon.Rise,
        Set: friday.Moon.Set,
        Phase: friday.Moon.Phase,
        Age: friday.Moon.Age,
      },
    };

    addLog('success', '[AccuWeather] Dados processados com sucesso', { date: accuweatherData.date });
    
    return NextResponse.json({ accuweatherData });

  } catch (error) {
    addLog('error', '[AccuWeather] Erro inesperado', { error: String(error) });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
