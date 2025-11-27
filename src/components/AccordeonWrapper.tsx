'use client'
import { useState, useRef, useEffect, ReactNode } from 'react';

interface AccordeonWrapperProps {
  children: ReactNode; // Conteúdo interno do acordeão
  initialExpanded?: boolean; // Se deve iniciar expandido ou colapsado
  className?: string; // Classes CSS customizadas para o container
  header?: ReactNode | ((isExpanded: boolean) => ReactNode); // Header pode ser estático ou função dinâmica
  headerClassName?: string; // Classes CSS para o header
  contentClassName?: string; // Classes CSS para o container de conteúdo
}

export default function AccordeonWrapper({
  children, // Conteúdo que será mostrado/escondido
  initialExpanded = true, // Por padrão inicia expandido
  className = "", // Classes CSS extras (padrão vazio)
  header, // Elemento clicável do header
  headerClassName = "", // Classes CSS do header (padrão vazio)
  contentClassName = "" // Classes CSS do conteúdo (padrão vazio)
}: AccordeonWrapperProps) {

  // Estado que controla se o acordeão está aberto (true) ou fechado (false)
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  // Referência direta ao elemento DOM do acordeão para manipulação de estilos
  const accordeonRef = useRef<HTMLDivElement>(null);

  // Hook que executa sempre que isExpanded mudar
  useEffect(() => {
    if (accordeonRef.current) {
      // Aplica o CSS Grid diretamente no DOM:
      // '1fr' = altura flexível (expandido)
      // '0fr' = altura zero (colapsado)
      accordeonRef.current.style.gridTemplateRows = isExpanded ? '1fr' : '0fr';
    }
  }, [isExpanded]); // Dependência: executa quando isExpanded muda

  // Função que lida com o clique no header para expandir/colapsar
  const handleAccordeonClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const accordeonElement = event.currentTarget; // Elemento que foi clicado

    setIsExpanded((prev) => {
      const nextState = !prev; // Inverte o estado atual

      // Aplica mudança diretamente no DOM para performance instantânea
      accordeonElement.style.gridTemplateRows = nextState ? '1fr' : '0fr';

      return nextState; // Retorna novo estado
    });
  };

  // Função que renderiza o header baseado no seu tipo
  const renderHeader = () => {
    // Se header é uma função, chama ela passando o estado atual
    if (typeof header === 'function') {
      return header(isExpanded);
    }
    // Se não, retorna o header como está (ReactNode estático)
    return header;
  };

  return (
    <div
      ref={accordeonRef} // Referência para manipulação direta do DOM
      className={`accordeon ${className}`} // Classe base + classes customizadas
      style={{ gridTemplateRows: initialExpanded ? '1fr' : '0fr' }} // Estado inicial do CSS Grid
    >
      {/* Container com overflow hidden para esconder conteúdo quando colapsado */}
      <div className={`overflow-hidden ${contentClassName}`}>

        {/* Renderiza header apenas se foi fornecido */}
        {header && (
          <div
            className={`cursor-pointer ${headerClassName}`} // Mostra cursor de clique
            onClick={handleAccordeonClick} // Função que alterna estado
          >
            {renderHeader()} {/* Renderiza header estático ou dinâmico */}
          </div>
        )}

        {/* Conteúdo principal do acordeão */}
        {children}
      </div>
    </div>
  );
}