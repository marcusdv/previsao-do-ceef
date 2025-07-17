import Link from "next/link";

export default function Sobre() {
  return (
    <div className="font-sans min-h-screen p-8 pb-20 sm:p-20">
      <main className="max-w-4xl mx-auto">
        text-sm text-gray-600
        <div className="space-y-8 text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">
              O que é o Sexta Tempo?
            </h2>
            <p>
              O <strong>Sexta Tempo</strong> é uma aplicação web especializada em mostrar 
              a previsão do tempo especificamente para as sextas-feiras no bairro de 
              <strong> Ondina</strong>, em Salvador-BA.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">
              Por que foi criado?
            </h2>
            <p>
              Ondina é um dos bairros mais procurados de Salvador para curtir a praia, 
              eventos e a vida noturna, especialmente nas sextas-feiras. O app foi 
              desenvolvido para ajudar moradores e visitantes a se programarem melhor 
              para aproveitar tudo que a região oferece.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">
              Como funciona?
            </h2>
            <div className="space-y-3">
              <p>🌤️ <strong>Consulta automática:</strong> O app busca a previsão do tempo para a próxima sexta-feira</p>
              <p>📱 <strong>Interface responsiva:</strong> Funciona perfeitamente em celulares, tablets e desktops</p>
              <p>🎯 <strong>Foco em Ondina:</strong> Informações específicas para o bairro que você quer conhecer</p>
              <p>⚡ <strong>Rápido e simples:</strong> Informação direta, sem complicações</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">
              Ideal para quem...
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Quer curtir a praia de Ondina nas sextas-feiras</li>
              <li>Planeja eventos na região</li>
              <li>Trabalha ou estuda em Ondina</li>
              <li>Gosta de se programar com antecedência</li>
              <li>Quer aproveitar a vida noturna local</li>
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
