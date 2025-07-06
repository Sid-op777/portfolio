"use client"

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {

  const { theme, setTheme } = useTheme()

  // const applyTheme = (newTheme: "light" | "dark") => {
  //   if (newTheme === "dark") {
  //     document.documentElement.classList.add("dark")
  //   } else {
  //     document.documentElement.classList.remove("dark")
  //   }
  // }

  // const toggleTheme = () => {
  //   const newTheme = theme === "light" ? "dark" : "light"
  //   setTheme(newTheme)
  //   document.documentElement.classList.toggle("dark", newTheme === "dark")
  //   localStorage.setItem("theme", newTheme)
  // }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  )
}
