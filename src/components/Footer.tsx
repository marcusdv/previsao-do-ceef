export default function Footer() {
    return (
        <footer className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-center py-4 ">
            <p className="text-sm">
                &copy; {new Date().getFullYear()} Farmatempo. Todos os direitos reservados.
            </p>
            <p className="text-xs mt-2">
                Desenvolvido por <span className="hover:text-yellow-200 cursor-pointer" >marcusdv</span>
            </p>
        </footer>
    )
}