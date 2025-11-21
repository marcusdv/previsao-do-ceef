export default function shouldMakeApiRequest(): { shouldRequest: boolean; cacheTime: number } {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=domingo, 1=segunda, 2=terça, 3=quarta, 4=quinta, 5=sexta, 6=sábado

  // ESTRATÉGIA DE CACHE: 30 MINUTOS

  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    return { shouldRequest: true, cacheTime: 43200 }; // 12 horas
  }
  return { shouldRequest: true, cacheTime: 86400 }; // 24 horas
}