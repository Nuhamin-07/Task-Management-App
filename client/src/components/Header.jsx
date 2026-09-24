import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckSquare,
  Plus,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import { toast } from "sonner";

export default function Header() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  async function handleLogout() {
    try {
      await fetch(
        "https://task-management-app-4-ina7.onrender.com/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      toast.error(`Logout failed: ${err.message}`);
    }
  }

  const userInitials = user
    ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-6">
          <Link
            to="/tasks"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg p-1"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs transition-transform group-hover:scale-105">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none tracking-tight text-foreground">
                Daily Task
              </span>
              <span className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase">
                Task Workspace
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          {user && (
            <nav className="hidden md:flex items-center gap-1 ml-4 border-l border-border pl-6">
              <Link
                to="/tasks"
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === "/tasks"
                    ? "bg-secondary text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </nav>
          )}
        </div>

        {/* Right Section / Actions */}
        <div className="flex items-center gap-3">
          {/* Create Task Quick Action */}
          {user && (
            <Button
              size="sm"
              onClick={() => navigate("/task/new")}
              className="hidden sm:inline-flex items-center gap-1.5 shadow-xs font-medium"
            >
              <Plus className="h-4 w-4" />
              <span>New Task</span>
            </Button>
          )}

          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* User Profile Dropdown */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 h-10 px-2 py-1 hover:bg-secondary rounded-lg focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs border border-primary/20">
                    {userInitials}
                  </div>
                  <span className="hidden sm:inline-block text-sm font-medium max-w-[140px] truncate text-left">
                    {user.first_name} {user.last_name}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1">
                <DropdownMenuLabel className="font-normal p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate("/task/new")}
                  className="sm:hidden flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="h-4 w-4 text-muted-foreground" />
                  <span>Create New Task</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
