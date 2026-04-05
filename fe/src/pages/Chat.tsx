import { useState, useEffect, useRef } from 'react';

export default function Chat() {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState<string>('');

    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // scroll to down if messages changed
    useEffect(() => {
        const messagesContainer = messagesContainerRef.current;
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }, [messages, messagesContainerRef]);

    const sendMessage = (value?: string) => {
        let prompt = value || input;
        if (prompt.trim() === '') return;

        setMessages(prev => [...prev, `You: ${prompt}`]);
        const eventSource = new EventSource(`http://localhost:3000/chat/stream?prompt=${prompt}`);
        setInput('');

        eventSource.onmessage = (event) => {
            setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage && !lastMessage.startsWith('You:')) {
                    return [...prev.slice(0, -1), lastMessage + event.data];
                } else {
                    return [...prev, event.data];
                }
            });
        };

        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const SendMessageButton = (value: string) => {
        return (
            <button onClick={() => sendMessage(value)} className='h-full px-4 bg-blue-500 text-white rounded-md'>{value}</button>
        )
    }

    return (
        <div className="flex flex-col h-[calc(100vh-128px)] p-4">
            <h1 className="text-2xl font-bold mb-4">Chat with Ollama</h1>
            <div ref={messagesContainerRef} className="flex-grow border-gray-700 border rounded-md p-4 mb-4 bg-gray-900 h-[100%] overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.startsWith('You:') ? 'pl-2 border-t-2 border-gray-700 pt-2' : ''}>
                        {!msg.startsWith('You:') && <p className='pl-4 pb-2'>{msg}</p>}
                        {msg.startsWith('You:') && <p className='pb-2'><span className='font-bold'>You:</span> {msg.split('You: ')[1]}</p>}
                    </div>
                ))}
            </div>

            <div className="flex-grow border-gray-700 border rounded-md p-4 mb-4  min-h-16 gap-4 flex">
                {SendMessageButton('Hello')}
                {SendMessageButton('Tell me about my profile')}
            </div>

            <div className="flex">
                <input
                    type="text"
                    className="flex-grow border-gray-700 border rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => sendMessage()}
                >
                    Send
                </button>
            </div>
        </div>
    );
}