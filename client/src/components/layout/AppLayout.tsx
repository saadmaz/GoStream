import { Sidebar } from "./Sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto p-6 md:p-12 animate-enter">
          {children}
        </div>
      </main>
    </div>
  );
}
