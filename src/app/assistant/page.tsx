
'use client';

import { useState, useTransition } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, User, Send, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAssistantResponse } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

interface Message {
    sender: 'user' | 'assistant';
    text: string;
}

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
            <PageHeader title="Dijana's Personal Assistant" />
            <Card className="shadow-md flex flex-col h-[calc(100vh-10rem)]">
                <CardHeader>
                    {/* Header can be used for status or context */}
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'assistant' && (
                                <Avatar>
                                    <AvatarFallback><Bot /></AvatarFallback>
                                </Avatar>
                            )}
                            <div className={`rounded-lg px-4 py-2 max-w-sm ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                            {msg.sender === 'user' && (
                                <Avatar>
                                     <AvatarImage src="https://i.pravatar.cc/150?u=admin" alt="Dijana" />
                                     <AvatarFallback>D</AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                    {isPending && (
                         <div className="flex items-start gap-3">
                            <Avatar>
                                <AvatarFallback><Bot /></AvatarFallback>
                            </Avatar>
                            <div className="rounded-lg px-4 py-2 max-w-sm bg-muted flex items-center">
                                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="p-4 border-t">
                    <div className="flex w-full items-center space-x-2">
                        <Input 
                            type="text" 
                            placeholder="Ask your assistant..." 
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
