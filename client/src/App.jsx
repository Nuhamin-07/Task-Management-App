import router from "./router.jsx";
import { RouterProvider } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
