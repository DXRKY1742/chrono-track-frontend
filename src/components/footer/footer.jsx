// redux
import { useSelector } from "react-redux";

export default function Footer() {
  const currentTheme = useSelector(state => state.theme.currentTheme);
  const isDarkMode = currentTheme === 'arya-blue';
  
  return (
    <footer className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-[#2979FF] text-white"} text-center text-sm py-4`}>
      <p>&copy; {new Date().getFullYear()} ChronoTrack. Todos los derechos reservados.</p>
    </footer>
  );
}

