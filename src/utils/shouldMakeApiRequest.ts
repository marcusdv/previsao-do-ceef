/**
 * Define o tempo de cache das requisições de API baseado no dia da semana
 * @returns Objeto com shouldRequest (sempre true) e cacheTime em segundos
 * 
 * Lógica:
 * - Segunda a sexta: cache de 10 minutos (600s)
 * - Fim de semana: cache de 20 minutos (1200s)
 */
export default function shouldMakeApiRequest(): { shouldRequest: boolean; cacheTime: number } {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=domingo, 1=segunda, 2=terça, 3=quarta, 4=quinta, 5=sexta, 6=sábado

  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    return { shouldRequest: true, cacheTime: 3600 }; // 1 hora
  }
  return { shouldRequest: true, cacheTime: 72000 }; // 20 horas
}