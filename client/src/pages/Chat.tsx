import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAiChat } from "@/hooks/use-ai";
import { Send, Loader2, Sparkles, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  citedNotes?: any[];
}

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello. I am your second brain. Ask me anything about your notes, connections, or ideas." }
  ]);
  const { mutate: sendMessage, isPending } = useAiChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);

    sendMessage(userMessage, {
      onSuccess: (response) => {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: response.answer,
          citedNotes: response.citedNotes 
        }]);
      },
      onError: () => {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: "I apologize, but I encountered an error accessing your knowledge base." 
        }]);
      }
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-100px)]">
        <header className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-medium">Ask Your Brain</h1>
            <p className="text-sm text-muted-foreground">Semantic search powered by AI</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-1 -mx-4 md:px-4 space-y-6 mb-6">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={cn(
                "flex gap-4 animate-enter",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border text-xs font-medium",
                msg.role === "user" 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-secondary text-secondary-foreground border-border"
              )}>
                {msg.role === "user" ? "You" : "AI"}
              </div>
              
              <div className={cn(
                "max-w-[80%] rounded-2xl p-5 shadow-sm border text-sm md:text-base leading-relaxed",
                msg.role === "user" 
                  ? "bg-primary text-primary-foreground border-primary rounded-tr-sm" 
                  : "bg-card text-card-foreground border-border rounded-tl-sm"
              )}>
                <ReactMarkdown className="prose dark:prose-invert prose-sm max-w-none">
                  {msg.content}
                </ReactMarkdown>

                {msg.citedNotes && msg.citedNotes.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Sources:</p>
                    <div className="grid gap-2">
                      {msg.citedNotes.map((note: any) => (
                        <div key={note.id} className="flex items-start gap-2 p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer text-xs">
                          <BookOpen className="w-3 h-3 mt-0.5 text-primary/50" />
                          <div>
                            <span className="font-semibold block">{note.title}</span>
                            <span className="opacity-70 line-clamp-1">{note.content}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isPending && (
            <div className="flex gap-4 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center">AI</div>
              <div className="bg-secondary/20 h-12 w-24 rounded-2xl rounded-tl-sm"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="relative mt-auto">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isPending}
            placeholder="Ask about your notes..."
            className="w-full pl-6 pr-14 py-4 rounded-2xl bg-card border border-border shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-muted-foreground/50"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isPending}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
