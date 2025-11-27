import Image from "next/image";

type Header = {
  dataOpenMeteo: {
    dataHora: string | null;
  }[] | null;
  dayOfWeek: string;
  setDayOfWeek: React.Dispatch<React.SetStateAction<string>>;
}

export default function Header({ dataOpenMeteo, dayOfWeek, setDayOfWeek }: Header) {

  const dateHour = dataOpenMeteo && dataOpenMeteo.length > 0 ? dataOpenMeteo[0].dataHora : null;

  return (
    <header className="flex flex-col items-center mb-2 mt-6 w-8/12 justify-center ">

      {/* Header com favicon, título e data */}
      <div className="flex items-center w-2/7 justify-center mb-2 ">

        <Image
          src="/favicon.ico"
          alt="CEEFguru Logo"
          width={32}
          height={32}
          className="mr-3"
        />
        {/* Título principal da aplicação */}
        <h1 className="text-4xl font-bold text-gray-800">CEEFGuru</h1>

      </div>
      <h2 className="text-xl text-gray-600 mb-2 text-center w-10/12 md:w-full">
        Clima para o vôlei de sexta no <span className="font-semibold">CEEF/UFBA </span>
      </h2>


      {/* DIA DA SEMANA E DATA */}
      <div className="flex items-center gap-4 px-2 justify-center">

        {dateHour &&
          <div className="text-2xl text-gray-700">
            {dateHour.split(",")[0]}
          </div>
        }
        {dateHour &&
          <div className="text-2xl">
            <span className="text-2xl text-gray-700">{dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)} </span>
          </div>
        }
        <div className="relative inline-block w-12 h-5">
          <input
            checked={dayOfWeek === "sábado"}
            id="switch-component-1"
            type="checkbox"
            onChange={() => setDayOfWeek(dayOfWeek === "sábado" ? "sexta" : "sábado")}
            className="peer appearance-none w-12 h-5 bg-yellow-600 rounded-full checked:bg-black cursor-pointer transition-colors duration-300"
          />
          <label
            htmlFor="switch-component-1"
            className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-7 peer-checked:border-slate-800 cursor-pointer"
          />
        </div>

      </div>

    </header>
  )
}