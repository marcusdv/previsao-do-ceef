// Interface que define o formato dos dados meteorológicos padrão
export interface standardWeatherType {
  fonte: string; // Fonte dos dados meteorológicos
  dataHora: string; // Data e hora da medição ou previsão
  temperatura: number; // Temperatura registrada ou prevista
  descricao: string; // Descrição das condições meteorológicas
  probabilidadeChuva?: number | null; // Probabilidade de chuva (opcional)
  velocidadeVento?: number | null; // Velocidade do vento (opcional)
}
