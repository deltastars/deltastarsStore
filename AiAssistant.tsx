





import React, { useState, useEffect, useRef } from 'react';
import { useI18n, useGeminiAi } from '../contexts/I18nContext';
import { Product, ChatMessage, CartItem } from '../types';
import { COMPANY_INFO } from '../constants';
import { SparklesIcon, XIcon } from './lib/Icons';
import type { Chat } from '@google/genai';

interface AiAssistantProps {
  products: Product[];
  onClose: () => void;
  browsingHistory: Product[];
  purchaseHistory: CartItem[];
}

const TypingIndicator: React.FC = () => {
    const { t } = useI18n();
    return (
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            <span className="text-sm text-gray-500 font-medium">{t('aiAssistant.thinking')}</span>
        </div>
    );
};

export const AiAssistant: React.FC<AiAssistantProps> = ({ products, onClose, browsingHistory, purchaseHistory }) => {
  const { t, language } = useI18n();
  const { ai, status } = useGeminiAi();
  
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { role: 'model', text: t('aiAssistant.welcomeMessage') }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  
  // Update welcome message if language changes
  useEffect(() => {
    setMessages(msgs => {
        if (msgs.length === 1) {
            return [{ role: 'model', text: t('aiAssistant.welcomeMessage') }];
        }
        return msgs;
    });
  }, [t]);

  // Initialize chat session
  useEffect(() => {
    if (ai && status === 'ready') {
      const productContext = JSON.stringify(products.map(p => ({
        id: p.id,
        name_ar: p.name_ar,
        name_en: p.name_en,
        category: p.category,
        price: p.price,
        unit_ar: p.unit_ar,
        unit_en: p.unit_en,
      })));

      const browsingHistoryContext = JSON.stringify(browsingHistory.map(p => ({ id: p.id, name: language === 'ar' ? p.name_ar : p.name_en })));
      const purchaseHistoryContext = JSON.stringify(purchaseHistory.map(p => ({ id: p.id, name: language === 'ar' ? p.name_ar : p.name_en, quantity: p.quantity })));

      const shippingPolicy = `
- ${t('shipping.policyTitle')}:
- ${t('shipping.deliveryTimeJeddah')}
- ${t('shipping.deliveryTimeOther')}
- ${t('shipping.cost')}
- ${t('shipping.freeShippingThreshold')}`;


      const systemInstruction = `You are 'Nibras' (نبراس), a friendly and helpful AI shopping assistant for Delta Stars Store. Delta Stars is a specialized Saudi Arabian company that imports and trades fresh vegetables, fruits, dates, and eggs.

Your role is to:
1.  Answer customer questions about products using ONLY the provided product list.
2.  Provide recommendations based on customer requests (e.g., "suggest some sweet fruits").
3.  Give information about the company (e.g., contact details, address).
4.  Be polite, concise, and helpful.
5.  Always respond in the language of the user's query (Arabic or English).

NEW CAPABILITIES:
1. Personalized Recommendations: You can now provide recommendations based on the user's browsing and purchase history. Use this data to suggest relevant products. For example, if a user asks for recommendations, check their history and suggest similar or complementary items.
2. Shipping Information: You can answer questions about shipping and delivery based on the policy provided below.

USER CONTEXT (Use this for personalized recommendations):
- Recently Viewed Products: ${browsingHistoryContext}
- Past Purchases: ${purchaseHistoryContext}

SHIPPING & DELIVERY POLICY (Use this to answer shipping questions):
${shippingPolicy}

Here is the list of available products in JSON format. Do not invent products, prices, or details not present in this list.
${productContext}

If you cannot answer a question or if the user wants to place an order, politely suggest they contact customer service via WhatsApp at ${COMPANY_INFO.whatsapp} or by phone at ${COMPANY_INFO.phone}.`;


      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction },
        history: [{
          role: 'user',
          parts: [{ text: 'Hello' }]
        }, {
          role: 'model',
          parts: [{ text: t('aiAssistant.welcomeMessage') }]
        }],
      });
    }
  }, [ai, products, status, t, browsingHistory, purchaseHistory, language]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        throw new Error("Chat not initialized");
      }
      const result = await chatRef.current.sendMessage({ message: userMessage });
      const modelResponse = result.text;
      setMessages(prev => [...prev, { role: 'model', text: modelResponse }]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: t('aiAssistant.error') }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed bottom-6 ${language === 'ar' ? 'left-6' : 'right-6'} z-50 w-[90vw] max-w-md h-[70vh] max-h-[600px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden transition-all duration-300`}>
      {/* Header */}
      <header className="bg-primary text-white p-4 flex justify-between items-center shadow-md">
        <h3 className="text-lg font-bold">{t('aiAssistant.title')}</h3>
        <button onClick={onClose} aria-label="Close chat">
          <XIcon />
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="border-t p-4 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('aiAssistant.inputPlaceholder')}
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading || status !== 'ready'}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || status !== 'ready'}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {t('aiAssistant.send')}
          </button>
        </div>
      </form>
    </div>
  );
};