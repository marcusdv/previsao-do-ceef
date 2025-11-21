export default function shouldMakeApiRequest(): { shouldRequest: boolean; cacheTime: number } {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=domingo, 1=segunda, 2=terça, 3=quarta, 4=quinta, 5=sexta, 6=sábado

  // ESTRATÉGIA DE CACHE: 30 MINUTOS

  // Segunda a sexta (1-5): Cache de 30 minutos
  // - Nestes dias, a API de 5 dias consegue retornar dados da próxima sexta-feira
  // - Cache curto para manter dados sempre atualizados
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    return { shouldRequest: true, cacheTime: 1800 }; // 30 minutos (30 * 60 = 1800 segundos)
  }

  // Fim de semana (sábado e domingo): Cache de 30 minutos também
  // - Mantém consistência no tempo de cache
  return { shouldRequest: true, cacheTime: 1800 }; // 30 minutos
}