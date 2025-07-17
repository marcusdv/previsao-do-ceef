import Link from "next/link";

export default function Sobre() {
  return (
    <div className="font-sans min-h-screen p-8 pb-20 sm:p-20">
      <main className="max-w-4xl mx-auto">
        <div className="space-y-8 text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">
              O que é o Farmatempo?
            </h2>
            <p>
              O <strong>Farmatempo</strong> é uma aplicação web especializada em mostrar 
              a previsão do tempo para o dia do vôlei do curso de farmácia da 
              <strong> UFBA</strong> (Universidade Federal da Bahia), em Salvador-BA.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">
              Por que foi criado?
            </h2>
            <p>
              Os estudantes de farmácia da UFBA têm seu dia especial de vôlei e precisam 
              se programar com antecedência para saber se o tempo estará favorável. O app foi 
              desenvolvido para ajudar os alunos a se organizarem melhor e aproveitarem 
              ao máximo seu momento de lazer e confraternização.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">
              Como funciona?
            </h2>
            <div className="space-y-3">
              <p>🌤️ <strong>Consulta automática:</strong> O app busca a previsão do tempo para a próxima sexta-feira</p>
              <p>📱 <strong>Interface responsiva:</strong> Funciona perfeitamente em celulares, tablets e desktops</p>
              <p>� <strong>Foco no vôlei:</strong> Informações específicas para o dia do jogo</p>
              <p>⚡ <strong>Rápido e simples:</strong> Informação direta, sem complicações</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">
              Ideal para...
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Estudantes de farmácia da UFBA</li>
              <li>Quem participa do vôlei de sexta-feira</li>
              <li>Organizadores de eventos esportivos da faculdade</li>
              <li>Quem gosta de se programar com antecedência</li>
              <li>Galera que não quer perder o jogo por causa da chuva</li>
            </ul>
          </section>

          <section className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">
              Tecnologias utilizadas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <h3 className="font-semibold">Next.js</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Framework React</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold">Tailwind CSS</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Estilização</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold">TypeScript</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tipagem estática</p>
              </div>
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">
              Contribua com o projeto
            </h2>
            <p className="mb-4">
              O Sexta Tempo é um projeto open source. Sinta-se à vontade para 
              contribuir com melhorias, sugestões ou reportar problemas!
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                href="/"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Voltar ao início
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
