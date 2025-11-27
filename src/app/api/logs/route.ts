// API Route para visualizar logs em tempo real
// Acesse /api/logs no navegador para ver os logs da aplicação

import { NextResponse } from 'next/server';

// Tipo para os detalhes do log (pode ser qualquer objeto JSON-serializável)
type LogDetails = Record<string, unknown> | string | number | boolean | null;

// Tipo para uma entrada de log
interface LogEntry {
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
 * Limpa todos os logs
 */
export function clearLogs() {
  logs = [];
}

/**
 * GET /api/logs - Retorna os logs em HTML ou JSON
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'html';
  
  // Retorna JSON se solicitado
  if (format === 'json') {
    return NextResponse.json({ logs, total: logs.length });
  }
  
  // Retorna HTML para visualização no navegador
  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Logs - CEEFGuru</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 20px;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        header {
          background: white;
          padding: 20px 30px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        h1 {
          color: #333;
          font-size: 24px;
        }
        
        .controls {
          display: flex;
          gap: 10px;
        }
        
        button {
          background: #667eea;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.3s;
        }
        
        button:hover {
          background: #5568d3;
        }
        
        button.clear {
          background: #ef4444;
        }
        
        button.clear:hover {
          background: #dc2626;
        }
        
        .stats {
          background: white;
          padding: 15px 30px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
          display: flex;
          gap: 30px;
        }
        
        .stat {
          display: flex;
          flex-direction: column;
        }
        
        .stat-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }
        
        .logs {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .log-entry {
          padding: 15px 30px;
          border-bottom: 1px solid #e5e7eb;
          display: grid;
          grid-template-columns: 180px 80px 1fr;
          gap: 15px;
          align-items: start;
          transition: background 0.2s;
        }
        
        .log-entry:hover {
          background: #f9fafb;
        }
        
        .log-entry:last-child {
          border-bottom: none;
        }
        
        .timestamp {
          color: #6b7280;
          font-size: 13px;
          font-family: 'Courier New', monospace;
        }
        
        .level {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .level.info {
          background: #dbeafe;
          color: #1e40af;
        }
        
        .level.success {
          background: #d1fae5;
          color: #065f46;
        }
        
        .level.error {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .level.warning {
          background: #fef3c7;
          color: #92400e;
        }
        
        .message {
          color: #374151;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .details {
          margin-top: 8px;
          padding: 10px;
          background: #f3f4f6;
          border-radius: 6px;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: #4b5563;
          white-space: pre-wrap;
          word-break: break-all;
        }
        
        .empty {
          padding: 60px 30px;
          text-align: center;
          color: #9ca3af;
        }
        
        .empty-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }
      </style>
      <script>
        // Auto-refresh a cada 5 segundos
        setTimeout(() => {
          location.reload();
        }, 5000);
        
        // Função para limpar logs
        async function clearLogs() {
          if (confirm('Tem certeza que deseja limpar todos os logs?')) {
            await fetch('/api/logs', { method: 'DELETE' });
            location.reload();
          }
        }
        
        // Função para baixar logs como JSON
        function downloadLogs() {
          window.open('/api/logs?format=json', '_blank');
        }
      </script>
    </head>
    <body>
      <div class="container">
        <header>
          <h1>📊 Logs do Sistema - CEEFGuru</h1>
          <div class="controls">
            <button onclick="location.reload()">🔄 Atualizar</button>
            <button onclick="downloadLogs()">💾 Baixar JSON</button>
            <button class="clear" onclick="clearLogs()">🗑️ Limpar</button>
          </div>
        </header>
        
        <div class="stats">
          <div class="stat">
            <span class="stat-label">Total de Logs</span>
            <span class="stat-value">${logs.length}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Erros</span>
            <span class="stat-value" style="color: #ef4444;">${logs.filter(l => l.level === 'error').length}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Sucesso</span>
            <span class="stat-value" style="color: #10b981;">${logs.filter(l => l.level === 'success').length}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Auto-refresh</span>
            <span class="stat-value" style="font-size: 14px;">5s</span>
          </div>
        </div>
        
        <div class="logs">
          ${logs.length === 0 ? `
            <div class="empty">
              <div class="empty-icon">📭</div>
              <p>Nenhum log registrado ainda</p>
            </div>
          ` : logs.map(log => `
            <div class="log-entry">
              <div class="timestamp">${new Date(log.timestamp).toLocaleString('pt-BR')}</div>
              <div>
                <span class="level ${log.level}">${log.level}</span>
              </div>
              <div>
                <div class="message">${log.message}</div>
                ${log.details ? `<div class="details">${JSON.stringify(log.details, null, 2)}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </body>
    </html>
  `;
  
  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

/**
 * DELETE /api/logs - Limpa todos os logs
 */
export async function DELETE() {
  clearLogs();
  return NextResponse.json({ message: 'Logs limpos com sucesso' });
}