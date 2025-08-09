
'use client';

import { useState, useTransition } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, User, Send, Loader2, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAssistantResponse } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

interface Message {
    sender: 'user' | 'assistant';
    text: string;
}

const STARTER_PROMPTS = [
    "What jobs are on today's run sheet and are there any urgent issues?",
    "Show me all unscheduled jobs for the week",
    "Generate a financial summary for this month",
    "Is there a cleaner available for a job in Southeast Melbourne next Thursday?",
    "Identify our top clients and suggest follow-ups",
    "Are there any overdue invoices I should know about?"
];

export default function AssistantPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleSendMessage = () => {
        if (input.trim() === '') return;

        const newMessages: Message[] = [...messages, { sender: 'user', text: input }];
        setMessages(newMessages);
        const currentInput = input;
        setInput('');

        startTransition(async () => {
            const response = await getAssistantResponse(currentInput);
            if (response.success && response.data) {
                setMessages([...newMessages, { sender: 'assistant', text: response.data.response }]);
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: response.error,
                });
                 setMessages(messages); // Revert to previous state on error
            }
        });
    };

    return (
        <>
            <PageHeader title="Astra - Your Business Assistant" />
            <Card className="shadow-md flex flex-col h-[calc(100vh-10rem)]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Astra AI Assistant
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Your proactive business assistant for Clean Freaks Co. Ask about operations, scheduling, financials, and more.
                    </p>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <Avatar className="w-16 h-16">
                                    <AvatarFallback className="bg-primary/10">
                                        <Sparkles className="w-8 h-8 text-primary" />
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div>
                                <h3 className="font-semibold">Welcome to Astra!</h3>
                                <p className="text-sm text-muted-foreground">Your AI business assistant is ready to help. Try asking:</p>
                            </div>
                            <div className="grid grid-cols-1 gap-2 max-w-lg mx-auto">
                                {STARTER_PROMPTS.map((prompt, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        size="sm"
                                        className="text-left justify-start h-auto py-2 px-3 whitespace-normal"
                                        onClick={() => setInput(prompt)}
                                    >
                                        {prompt}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'assistant' && (
                                <Avatar>
                                    <AvatarFallback className="bg-primary/10">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                    </AvatarFallback>
                                </Avatar>
                            )}
                            <div className={`rounded-lg px-4 py-2 max-w-lg ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                            {msg.sender === 'user' && (
                                <Avatar>
                                     <AvatarImage src="https://ui-avatars.io/api/?name=Dijana&background=E6E6FA&color=800000" alt="Dijana" />
                                     <AvatarFallback>D</AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                    {isPending && (
                         <div className="flex items-start gap-3">
                            <Avatar>
                                <AvatarFallback className="bg-primary/10">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="rounded-lg px-4 py-2 max-w-sm bg-muted flex items-center">
                                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                                <span className="ml-2 text-sm text-muted-foreground">Astra is thinking...</span>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="p-4 border-t">
                    <div className="flex w-full items-center space-x-2">
                        <Input 
                            type="text" 
                            placeholder="Ask Astra about your business..." 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="flex-1"
                            disabled={isPending}
                        />
                        <Button type="submit" onClick={handleSendMessage} disabled={isPending || !input.trim()}>
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            <span className="sr-only">Send</span>
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </>
    );
}
