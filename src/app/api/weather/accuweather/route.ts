// API Route que roda no servidor Next.js para fazer proxy das requisições AccuWeather
// Isso evita problemas de CORS e mantém a API key segura (não exposta no cliente)

import { NextResponse } from 'next/server';
import { AccuWeatherDataType } from '@/types/accuweatherType';
import shouldMakeApiRequest from '@/utils/shouldMakeApiRequest';
import { addLog } from '@/utils/logger';

export async function GET(request: Request) {
  const { cacheTime } = shouldMakeApiRequest();
  
  // Extrai o parâmetro 'day' da URL (query parameter)
  const { searchParams } = new URL(request.url);
  const dayParam = searchParams.get('day');
  const day = dayParam ? parseInt(dayParam) : 5; // Default é 5 (sexta-feira)
  
  // Valida se o dia é 5 ou 6
  if (day !== 5 && day !== 6) {
    addLog('error', '[AccuWeather] Dia inválido', { day });
    return NextResponse.json({ error: 'Dia deve ser 5 (sexta) ou 6 (sábado)' }, { status: 400 });
  }
  
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

    addLog('info', '[AccuWeather] Response status', { status: response.status, day });

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

    // Usa o parâmetro 'day' ao invés de hardcoded 5
    const targetDay = data.DailyForecasts.find((d: { Date: string }) => {
      const date = new Date(d.Date);
      return date.getDay() === day; // Agora usa a variável 'day' (5 ou 6)
    });

    if (!targetDay) {
      addLog('warning', '[AccuWeather] Dia não encontrado nas previsões', { day });
      return NextResponse.json({ accuweatherData: null });
    }

    const accuweatherData: AccuWeatherDataType = {
      date: targetDay.Date,
      temperature: {
        max: targetDay.Temperature.Maximum.Value,
        min: targetDay.Temperature.Minimum.Value,
      },
      realFeelTemperature: {
        max: targetDay.RealFeelTemperature.Maximum.Value,
        min: targetDay.RealFeelTemperature.Minimum.Value,
      },
      day: {
        hasPrecipitation: targetDay.Day.HasPrecipitation,
        longPhrase: targetDay.Day.LongPhrase,
        precipitationProbability: targetDay.Day.PrecipitationProbability,
        thunderstormProbability: targetDay.Day.ThunderstormProbability,
        wind: {
          speed: targetDay.Day.Wind.Speed.Value,
          direction: targetDay.Day.Wind.Direction.English,
        },
      },
      night: {
        hasPrecipitation: targetDay.Night.HasPrecipitation,
        longPhrase: targetDay.Night.LongPhrase,
        precipitationProbability: targetDay.Night.PrecipitationProbability,
        thunderstormProbability: targetDay.Night.ThunderstormProbability,
        wind: {
          speed: targetDay.Night.Wind.Speed.Value,
          direction: targetDay.Night.Wind.Direction.English,
        },
      },
      sun: {
        Rise: targetDay.Sun.Rise,
        Set: targetDay.Sun.Set,
      },
      moon: {
        Rise: targetDay.Moon.Rise,
        Set: targetDay.Moon.Set,
        Phase: targetDay.Moon.Phase,
        Age: targetDay.Moon.Age,
      },
    };

    addLog('success', '[AccuWeather] Dados processados com sucesso', { 
      date: accuweatherData.date, 
      day,
      temperature: accuweatherData.temperature 
    });
    
    return NextResponse.json({ accuweatherData });

  } catch (error) {
    addLog('error', '[AccuWeather] Erro inesperado', { error: String(error) });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}