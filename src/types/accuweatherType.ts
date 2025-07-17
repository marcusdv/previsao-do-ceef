interface DayPeriodType {
  hasPrecipitation: boolean;
  longPhrase: string;
  precipitationProbability: number;
  thunderstormProbability: number;
  wind: {
    speed: number;
    direction: string;
  };
}

interface MoonDataType {
  Rise: string | null;
  Set: string;
  Phase: string;
  Age: number;
}

interface SunDataType {
  Rise: string;
  Set: string;
}

export interface AccuWeatherDataType {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  realFeelTemperature: {
    min: number;
    max: number;
  };
  day: DayPeriodType;
  night: DayPeriodType;
  sun: SunDataType | null;
  moon: MoonDataType | null;
}
