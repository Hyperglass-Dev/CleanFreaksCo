
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, User, Send, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
    sender: 'user' | 'assistant';
    text: string;
}

export default function AssistantPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = () => {
        if (input.trim() === '') return;

        const newMessages = [...messages, { sender: 'user' as 'user', text: input }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        // Mock AI response
        setTimeout(() => {
            setMessages([...newMessages, { sender: 'assistant' as 'assistant', text: "This is a placeholder response from your AI assistant. Once you connect a real AI model, I'll be able to provide helpful information and complete tasks for you." }]);
            setIsLoading(false);
        }, 1500);
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
                    {isLoading && (
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
                        />
                        <Button type="submit" onClick={handleSendMessage} disabled={isLoading}>
                            <Send className="w-4 h-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </>
    );
}
