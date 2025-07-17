// import xml2js from "xml2js";

// export async function getCptecFridayForecast() {
//   try {
//     // 1. Busca o código da cidade Salvador
//     const buscaResp = await fetch(`http://servicos.cptec.inpe.br/XML/listaCidades?city=Salvador`);
//     const buscaXml = await buscaResp.text();
//     const buscaObj = await xml2js.parseStringPromise(buscaXml);
//     const id = buscaObj.cidades.cidade[0].id[0];


//     // 2. Busca a previsão usando o ID da cidade
//     const previsaoResp = await fetch(`http://servicos.cptec.inpe.br/XML/cidade/-13.008085569770852/-38.51330742515813/estendidaLatLon.xml`);
//     const previsaoXml = await previsaoResp.text();
//     const previsaoObj = await xml2js.parseStringPromise(previsaoXml);

//     console.log("Dados brutos do CPTEC/INPE:", previsaoObj);

//     // 3. Filtra apenas os dados de sexta-feira
//     const sextaPrevisao = previsaoObj.cidade.previsao.filter((prev: any) => {
//       const date = new Date(prev.dia[0]);
//       return date.getDay() === 5; // 5 = sexta-feira
//     });

//     if (sextaPrevisao.length === 0) {
//       console.log("Nenhuma previsão encontrada para sexta-feira");
//       return { cptecData: [] };
//     }

//     // 4. Converte os dados para o formato padrão
//     const cptecData = sextaPrevisao.map((prev: any) => ({
//       fonte: "CPTEC/INPE",
//       dataHora: new Date(prev.dia[0]).toLocaleString("pt-BR", {
//         timeZone: "America/Bahia",
//       }),
//       temperatura: (Number(prev.maxima[0]) + Number(prev.minima[0])) / 2, // média entre máx e mín
//       descricao: getWeatherDescription(prev.tempo[0]),
//       temperaturaMaxima: Number(prev.maxima[0]),
//       temperaturaMinima: Number(prev.minima[0]),
//       iuv: Number(prev.iuv[0]),
//     }));

//     console.log("Previsão para sexta-feira:", cptecData);
//     return { cptecData };

//   } catch (error) {
//     console.error("Erro ao buscar dados do CPTEC/INPE:", error);
//     return { cptecData: [] };
//   }
// }

// // Função auxiliar para converter códigos de tempo em descrições
// function getWeatherDescription(codigo: string): string {
//   const descricoes: { [key: string]: string } = {
//     'ec': 'Encoberto com Chuvas Isoladas',
//     'ci': 'Chuvas Isoladas',
//     'c': 'Chuva',
//     'in': 'Instável',
//     'pp': 'Possibilidade de Precipitação',
//     'cm': 'Chuva pela Manhã',
//     'cn': 'Chuva à Noite',
//     'pt': 'Pancadas de Chuva à Tarde',
//     'pm': 'Pancadas de Chuva pela Manhã',
//     'np': 'Nublado e Pancadas de Chuva',
//     'pc': 'Pancadas de Chuva',
//     'pn': 'Parcialmente Nublado',
//     'cv': 'Chuvisco',
//     'ch': 'Chuvoso',
//     't': 'Tempestade',
//     'ps': 'Predomínio de Sol',
//     'e': 'Encoberto',
//     'n': 'Nublado',
//     'cl': 'Céu Claro',
//     'nv': 'Nevoeiro',
//     'g': 'Geada',
//     'ne': 'Neve',
//     'nd': 'Não Definido',
//     'pnt': 'Pancadas de Chuva à Noite',
//     'psc': 'Possibilidade de Chuva',
//     'pcm': 'Possibilidade de Chuva pela Manhã',
//     'pct': 'Possibilidade de Chuva à Tarde',
//     'pcn': 'Possibilidade de Chuva à Noite',
//     'npt': 'Nublado com Pancadas à Tarde',
//     'npn': 'Nublado com Pancadas à Noite',
//     'ncn': 'Nublado com Possibilidade de Chuva à Noite',
//     'nct': 'Nublado com Possibilidade de Chuva à Tarde',
//     'ncm': 'Nublado com Possibilidade de Chuva pela Manhã',
//     'npm': 'Nublado com Pancadas pela Manhã',
//     'npp': 'Nublado com Possibilidade de Chuva',
//     'vn': 'Variação de Nebulosidade',
//     'ct': 'Chuva à Tarde',
//     'ppn': 'Possibilidade de Pancadas de Chuva à Noite',
//     'ppt': 'Possibilidade de Pancadas de Chuva à Tarde',
//     'ppm': 'Possibilidade de Pancadas de Chuva pela Manhã'
//   };
  
//   return descricoes[codigo] || 'Não Definido';
// }