// Utilitário centralizado para gerenciar logs da aplicação

// Tipo para os detalhes do log (pode ser qualquer objeto JSON-serializável)
type LogDetails = Record<string, unknown> | string | number | boolean | null;

// Tipo para uma entrada de log
export interface LogEntry {
  timestamp: string;
  level: 'info' | 'error' | 'success' | 'warning';
  message: string;
  details?: LogDetails;
}

// Array para armazenar logs em memória
let logs: LogEntry[] = [];

// Limite de logs armazenados (para não usar muita memória)
const MAX_LOGS = 100;

/**
 * Adiciona um log ao array
 */
export function addLog(
  level: 'info' | 'error' | 'success' | 'warning', 
  message: string, 
  details?: LogDetails
) {
  const log: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    details
  };
  
  logs.unshift(log); // Adiciona no início do array (mais recente primeiro)
  
  // Mantém apenas os últimos MAX_LOGS
  if (logs.length > MAX_LOGS) {
    logs = logs.slice(0, MAX_LOGS);
  }
  
  // Ainda exibe no console do servidor para debug
  const emoji = level === 'error' ? '❌' : level === 'success' ? '✅' : level === 'warning' ? '⚠️' : '📡';
  console.log(`${emoji} ${message}`, details || '');
}

/**
 * Retorna todos os logs
 */
export function getLogs(): LogEntry[] {
  return logs;
}

/**
 * Limpa todos os logs
 */
export function clearLogs() {
  logs = [];
}
