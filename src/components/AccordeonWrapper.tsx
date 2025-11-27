'use client'
import { useState, useRef, useEffect, ReactNode } from 'react';

interface AccordeonWrapperProps {
  children: ReactNode;
  initialExpanded?: boolean;
  className?: string;
  header?: ReactNode | ((isExpanded: boolean) => ReactNode); // Mudança aqui
  headerClassName?: string;
  contentClassName?: string;
}

export default function AccordeonWrapper({
  children,
  initialExpanded = true,
  className = "",
  header,
  headerClassName = "",
  contentClassName = ""
}: AccordeonWrapperProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const accordeonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (accordeonRef.current) {
      accordeonRef.current.style.gridTemplateRows = isExpanded ? '1fr' : '0fr';
    }
  }, [isExpanded]);

  const handleAccordeonClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const accordeonElement = event.currentTarget;
    setIsExpanded((prev) => {
      const nextState = !prev;
      accordeonElement.style.gridTemplateRows = nextState ? '1fr' : '0fr';
      return nextState;
    });
  };

  // Renderizar header baseado no tipo
  const renderHeader = () => {
    if (typeof header === 'function') {
      return header(isExpanded);
    }
    return header;
  };

  return (
    <div
      ref={accordeonRef}
      className={`accordeon ${className}`}
      style={{ gridTemplateRows: initialExpanded ? '1fr' : '0fr' }}
    >
      <div className={`overflow-hidden ${contentClassName}`}>
        {header && (
          <div
            className={`cursor-pointer ${headerClassName}`}
            onClick={handleAccordeonClick}
          >
            {renderHeader()}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}