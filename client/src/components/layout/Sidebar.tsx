import { Link, useLocation } from "wouter";
import { Brain, Library, PenTool, MessageSquare, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Capture", icon: PenTool, href: "/" },
  { label: "Library", icon: Library, href: "/library" },
  { label: "Graph", icon: Brain, href: "/graph" },
  { label: "Ask Brain", icon: MessageSquare, href: "/chat" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-20 lg:w-64 border-r border-border h-screen sticky top-0 bg-card flex flex-col justify-between p-4 transition-all duration-300">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
            <Brain className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold text-xl hidden lg:block tracking-tight">
            SecondBrain
          </span>
        </div>

        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive && "animate-pulse")} />
                  <span className="font-medium hidden lg:block">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto hidden lg:block">
        <Link href="/">
          <div className="w-full p-4 rounded-xl bg-secondary/50 border border-border/50 hover:border-primary/20 hover:bg-secondary transition-all cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center">
                <Plus className="w-4 h-4 text-foreground" />
              </div>
              <span className="font-semibold text-sm">Quick Note</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              Capture a thought quickly...
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
