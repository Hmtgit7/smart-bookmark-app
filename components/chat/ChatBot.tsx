// "use client";

// import { useState, useRef, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { sendChatMessage } from "@/app/actions/chat";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog";
// import { MessageCircle, Send, Loader2, Sparkles, AlertCircle } from "lucide-react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Alert, AlertDescription } from "@/components/ui/alert";

// interface Message {
//     role: "user" | "assistant" | "error";
//     content: string;
//     timestamp: Date;
// }

// export function ChatBot() {
//     const [open, setOpen] = useState(false);
//     const [messages, setMessages] = useState<Message[]>([
//         {
//             role: "assistant",
//             content: "Hi! 👋 I'm your bookmark assistant. Ask me anything like:\n\n• 'Find my React tutorials'\n• 'Show bookmarks from last week'\n• 'What's in my Learning category?'",
//             timestamp: new Date(),
//         },
//     ]);
//     const [input, setInput] = useState("");
//     const [isLoading, setIsLoading] = useState(false);
//     const scrollRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         if (scrollRef.current) {
//             scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//         }
//     }, [messages]);

//     // async function handleSend() {
//     //     if (!input.trim() || isLoading) return;

//     //     const userMessage: Message = {
//     //         role: "user",
//     //         content: input,
//     //         timestamp: new Date(),
//     //     };

//     //     setMessages((prev) => [...prev, userMessage]);
//     //     setInput("");
//     //     setIsLoading(true);

//     //     try {
//     //         const response = await fetch("/api/chat", {
//     //             method: "POST",
//     //             headers: { "Content-Type": "application/json" },
//     //             body: JSON.stringify({ message: input }),
//     //         });

//     //         const data = await response.json();

//     //         if (!response.ok || data.error) {
//     //             const errorMessage: Message = {
//     //                 role: "error",
//     //                 content: data.error || "Failed to get response. Please try again.",
//     //                 timestamp: new Date(),
//     //             };
//     //             setMessages((prev) => [...prev, errorMessage]);
//     //         } else {
//     //             const assistantMessage: Message = {
//     //                 role: "assistant",
//     //                 content: data.response,
//     //                 timestamp: new Date(),
//     //             };
//     //             setMessages((prev) => [...prev, assistantMessage]);
//     //         }
//     //     } catch (error) {
//     //         const errorMessage: Message = {
//     //             role: "error",
//     //             content: "Network error. Please check your connection and try again.",
//     //             timestamp: new Date(),
//     //         };
//     //         setMessages((prev) => [...prev, errorMessage]);
//     //     } finally {
//     //         setIsLoading(false);
//     //     }
//     // }
//     async function handleSend() {
//         if (!input.trim() || isLoading) return;

//         const userMessage: Message = {
//             role: "user",
//             content: input,
//             timestamp: new Date(),
//         };

//         setMessages((prev) => [...prev, userMessage]);
//         const userInput = input;
//         setInput("");
//         setIsLoading(true);

//         try {
//             const result = await sendChatMessage(userInput);

//             if (result.error) {
//                 const errorMessage: Message = {
//                     role: "error",
//                     content: result.error,
//                     timestamp: new Date(),
//                 };
//                 setMessages((prev) => [...prev, errorMessage]);
//             } else {
//                 const assistantMessage: Message = {
//                     role: "assistant",
//                     content: result.response || "No response received",
//                     timestamp: new Date(),
//                 };
//                 setMessages((prev) => [...prev, assistantMessage]);
//             }
//         } catch (error) {
//             const errorMessage: Message = {
//                 role: "error",
//                 content: "Network error. Please check your connection and try again.",
//                 timestamp: new Date(),
//             };
//             setMessages((prev) => [...prev, errorMessage]);
//         } finally {
//             setIsLoading(false);
//         }
//     }

//     function handleKeyPress(e: React.KeyboardEvent) {
//         if (e.key === "Enter" && !e.shiftKey) {
//             e.preventDefault();
//             handleSend();
//         }
//     }

//     return (
//         <>
//             {/* Floating Button */}
//             <Dialog open={open} onOpenChange={setOpen}>
//                 <DialogTrigger asChild>
//                     <Button
//                         size="lg"
//                         className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 hover:scale-110 transition-transform sm:h-16 sm:w-16"
//                         aria-label="Open AI Assistant"
//                     >
//                         <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
//                     </Button>
//                 </DialogTrigger>

//                 {/* Chat Dialog - Centered */}
//                 <DialogContent className="sm:max-w-[600px] max-w-[95vw] h-[80vh] sm:h-[600px] flex flex-col p-0 gap-0">
//                     <DialogHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b">
//                         <div className="flex items-center gap-3">
//                             <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
//                                 <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
//                             </div>
//                             <div className="min-w-0">
//                                 <DialogTitle className="text-base sm:text-lg">Bookmark Assistant</DialogTitle>
//                                 <DialogDescription className="text-xs sm:text-sm truncate">
//                                     Ask me anything about your bookmarks
//                                 </DialogDescription>
//                             </div>
//                         </div>
//                     </DialogHeader>

//                     <ScrollArea className="flex-1 px-4 sm:px-6" ref={scrollRef}>
//                         <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
//                             {messages.map((message, index) => (
//                                 <div
//                                     key={index}
//                                     className={`flex gap-2 sm:gap-3 ${message.role === "user" ? "justify-end" : "justify-start"
//                                         }`}
//                                 >
//                                     {message.role === "assistant" && (
//                                         <Avatar className="h-7 w-7 sm:h-8 sm:w-8 bg-primary/10 flex-shrink-0">
//                                             <AvatarFallback>
//                                                 <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
//                                             </AvatarFallback>
//                                         </Avatar>
//                                     )}
//                                     {message.role === "error" && (
//                                         <Avatar className="h-7 w-7 sm:h-8 sm:w-8 bg-destructive/10 flex-shrink-0">
//                                             <AvatarFallback>
//                                                 <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
//                                             </AvatarFallback>
//                                         </Avatar>
//                                     )}
//                                     <div
//                                         className={`rounded-lg px-3 py-2 max-w-[85%] sm:max-w-[80%] ${message.role === "user"
//                                             ? "bg-primary text-primary-foreground"
//                                             : message.role === "error"
//                                                 ? "bg-destructive/10 text-destructive border border-destructive/20"
//                                                 : "bg-muted"
//                                             }`}
//                                     >
//                                         <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">
//                                             {message.content}
//                                         </p>
//                                         <span className="text-[10px] sm:text-xs opacity-70 mt-1 block">
//                                             {message.timestamp.toLocaleTimeString([], {
//                                                 hour: "2-digit",
//                                                 minute: "2-digit",
//                                             })}
//                                         </span>
//                                     </div>
//                                     {message.role === "user" && (
//                                         <Avatar className="h-7 w-7 sm:h-8 sm:w-8 bg-primary flex-shrink-0">
//                                             <AvatarFallback className="text-primary-foreground text-[10px] sm:text-xs">
//                                                 You
//                                             </AvatarFallback>
//                                         </Avatar>
//                                     )}
//                                 </div>
//                             ))}
//                             {isLoading && (
//                                 <div className="flex gap-2 sm:gap-3 justify-start">
//                                     <Avatar className="h-7 w-7 sm:h-8 sm:w-8 bg-primary/10">
//                                         <AvatarFallback>
//                                             <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
//                                         </AvatarFallback>
//                                     </Avatar>
//                                     <div className="rounded-lg px-3 py-2 bg-muted flex items-center gap-2">
//                                         <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
//                                         <span className="text-xs sm:text-sm text-muted-foreground">Thinking...</span>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </ScrollArea>

//                     <div className="border-t px-4 sm:px-6 py-3 sm:py-4 bg-background">
//                         <div className="flex gap-2">
//                             <Input
//                                 placeholder="Ask about your bookmarks..."
//                                 value={input}
//                                 onChange={(e) => setInput(e.target.value)}
//                                 onKeyPress={handleKeyPress}
//                                 disabled={isLoading}
//                                 className="flex-1 text-sm"
//                             />
//                             <Button
//                                 onClick={handleSend}
//                                 disabled={isLoading || !input.trim()}
//                                 size="icon"
//                                 className="flex-shrink-0"
//                             >
//                                 {isLoading ? (
//                                     <Loader2 className="h-4 w-4 animate-spin" />
//                                 ) : (
//                                     <Send className="h-4 w-4" />
//                                 )}
//                             </Button>
//                         </div>
//                         <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 text-center">
//                             Powered by Google Gemini AI ✨
//                         </p>
//                     </div>
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// }

// components/chat/ChatBot.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Loader2, Sparkles, AlertCircle, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { sendChatMessage } from "@/app/actions/chat";
import { Card } from "@/components/ui/card";

interface Message {
    role: "user" | "assistant" | "error";
    content: string;
    timestamp: Date;
}

export function ChatBot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Hi! 👋 I'm your bookmark assistant. Ask me anything like:\n\n• 'Find my React tutorials'\n• 'Show bookmarks from last week'\n• 'What's in my Learning category?'",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    async function handleSend() {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: "user",
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        const userInput = input;
        setInput("");
        setIsLoading(true);

        try {
            const result = await sendChatMessage(userInput);

            if (result.error) {
                const errorMessage: Message = {
                    role: "error",
                    content: result.error,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, errorMessage]);
            } else {
                const assistantMessage: Message = {
                    role: "assistant",
                    content: result.response || "No response received",
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, assistantMessage]);
            }
        } catch (error) {
            const errorMessage: Message = {
                role: "error",
                content: "Network error. Please check your connection and try again.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }

    function handleKeyPress(e: React.KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <>
            {/* Chat Window - Positioned above the button */}
            {open && (
                <Card className="fixed bottom-24 right-6 w-[90vw] sm:w-[400px] h-[500px] sm:h-[600px] flex flex-col shadow-2xl border-2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b bg-primary/5">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 animate-pulse">
                                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-semibold text-base sm:text-lg">Bookmark Assistant</h3>
                                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                    Online • Ready to help
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setOpen(false)}
                            className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 px-4 sm:px-6" ref={scrollRef}>
                        <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex gap-2 sm:gap-3 animate-in slide-in-from-bottom-2 fade-in duration-300 ${message.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    {(message.role === "assistant" || message.role === "error") && (
                                        <Avatar className={`h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 ${message.role === "error" ? "bg-destructive/10" : "bg-primary/10"
                                            }`}>
                                            <AvatarFallback>
                                                {message.role === "error" ? (
                                                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
                                                ) : (
                                                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div
                                        className={`rounded-2xl px-3 py-2 max-w-[85%] sm:max-w-[80%] ${message.role === "user"
                                                ? "bg-primary text-primary-foreground rounded-br-sm"
                                                : message.role === "error"
                                                    ? "bg-destructive/10 text-destructive border border-destructive/20 rounded-bl-sm"
                                                    : "bg-muted rounded-bl-sm"
                                            }`}
                                    >
                                        <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">
                                            {message.content}
                                        </p>
                                        <span className="text-[10px] sm:text-xs opacity-70 mt-1 block">
                                            {message.timestamp.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                    {message.role === "user" && (
                                        <Avatar className="h-7 w-7 sm:h-8 sm:w-8 bg-primary flex-shrink-0">
                                            <AvatarFallback className="text-primary-foreground text-[10px] sm:text-xs font-semibold">
                                                You
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-2 sm:gap-3 justify-start animate-in slide-in-from-bottom-2 fade-in">
                                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 bg-primary/10">
                                        <AvatarFallback>
                                            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary animate-pulse" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="rounded-2xl rounded-bl-sm px-3 py-2 bg-muted flex items-center gap-2">
                                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-primary" />
                                        <span className="text-xs sm:text-sm text-muted-foreground">Thinking...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Input */}
                    <div className="border-t px-4 sm:px-6 py-3 sm:py-4 bg-background">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Ask about your bookmarks..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isLoading}
                                className="flex-1 text-sm rounded-full"
                            />
                            <Button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                size="icon"
                                className="flex-shrink-0 rounded-full h-10 w-10"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 text-center">
                            Powered by Groq AI ⚡
                        </p>
                    </div>
                </Card>
            )}

            {/* Floating Action Button with Attractive Animation */}
            <Button
                onClick={() => setOpen(!open)}
                size="lg"
                className={`fixed bottom-6 right-6 h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-2xl z-50 transition-all duration-300 ${open
                        ? "rotate-90 scale-90"
                        : "hover:scale-110 hover:shadow-primary/50 animate-bounce-slow"
                    }`}
                aria-label="Toggle AI Assistant"
            >
                {open ? (
                    <X className="h-6 w-6 sm:h-7 sm:w-7" />
                ) : (
                    <div className="relative">
                        <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
                        {/* Pulse effect */}
                        <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20"></span>
                    </div>
                )}
            </Button>
        </>
    );
}
