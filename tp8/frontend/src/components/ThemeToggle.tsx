import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-lg z-50"
      title={theme === "light" ? "Modo oscuro" : "Modo claro"}
    >
      {theme === "light" ? (
        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.75 9.75 0 0012 21a9.75 9.75 0 006.5-2.5 9 9 0 01.146 5.354zM12 18v.01M12 2v-2M4.293 4.293a1 1 0 011.414 0L7 5.586 5.586 7l-1.293-1.293a1 1 0 010-1.414zM17 5.586l1.293 1.293a1 1 0 010 1.414L17 8.414V7a1 1 0 00-1-1h-1zM12 22v-2M18 18H6a2 2 0 01-2-2v-2h14v2a2 2 0 01-2 2zM18 6V4h2v2h-2z" />
        </svg>
      ) : (
        <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </button>
  );
}