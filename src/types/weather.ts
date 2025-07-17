// /**
//  * Representa os dados meteorológicos para um timestamp específico.
//  *
//  * @property dt - O timestamp Unix (em segundos) para os dados meteorológicos.
//  * @property main - Métricas principais do clima.
//  * @property main.temp - Temperatura no timestamp informado (em graus Celsius).
//  * @property weather - Um array de objetos de condição climática.
//  * @property weather[].description - Uma descrição textual da condição climática.
//  */
// export interface WeatherData {
//     dt: number;
//     main: {
//         temp: number;
//     };
//     weather: Array<{
//         description: string;
//     }>;
// }

// /**
//  * Representa os dados de previsão do tempo para sextas-feiras.
//  *
//  * @property allFriday - Um array de objetos WeatherData para todas as sextas-feiras.
//  * @property rainFriday - Um array de objetos WeatherData para sextas-feiras com chuva.
//  */
// export interface FridayForecast {
//         allFriday: WeatherData[];
//         rainFriday: WeatherData[];
// }