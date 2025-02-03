export interface Provider {
    name: string;
    domain: string;
    isBlocked: boolean;
    selectors: {
        accessDenied: string;
        textbox: string;
    };
}
export const PROVIDERS: Provider[] = [
    {
        name: "Bing",
        domain: "copilot.microsoft.com",
        isBlocked: true,
        selectors: { accessDenied: "div:text('Access Denied')", textbox: 'textarea' }
    },
    {
        name: "Gemini",
        domain: "gemini.google.com",
        isBlocked: true,
        selectors: { accessDenied: "div:text('Access Denied')", textbox: 'textarea' }
    },
    {
        name: "GPT",
        domain: "chat.openai.com",
        isBlocked: false,
        selectors: { accessDenied: "div:text('Access Denied')", textbox: 'textarea' }
    },
     {
        name: "PerplexityAi",
        domain: "perplexity.ai",
        isBlocked: true,
        selectors: { accessDenied: "div:text('Access Denied')", textbox: 'textarea' }
    },
    {
        name: "Groq",
        domain: "groq.com",
        isBlocked: true,
        selectors: { accessDenied: "div:text('Access Denied')", textbox: 'textarea' }
    }
];
