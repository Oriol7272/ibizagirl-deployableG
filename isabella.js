/**
 * Isabella AI Assistant v2.0
 * Chatbot de IA para IbizaGirl.pics
 */

'use strict';

console.log('🤖 Cargando Isabella AI Assistant v2.0...');

class IsabellaAI {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.currentLanguage = 'es';
        this.languages = {
            es: {
                greeting: "¡Hola! Soy Isabella, tu asistente virtual de IbizaGirl.pics 🌴",
                help: "¿En qué puedo ayudarte?",
                typing: "Isabella está escribiendo...",
                send: "Enviar",
                placeholder: "Escribe tu mensaje...",
                quickActions: [
                    "Ver galería premium",
                    "Información de precios",
                    "Cómo funciona PayPal",
                    "Contenido exclusivo"
                ]
            },
            en: {
                greeting: "Hi! I'm Isabella, your virtual assistant at IbizaGirl.pics 🌴",
                help: "How can I help you?",
                typing: "Isabella is typing...",
                send: "Send",
                placeholder: "Type your message...",
                quickActions: [
                    "View premium gallery",
                    "Pricing information", 
                    "How PayPal works",
                    "Exclusive content"
                ]
            },
            fr: {
                greeting: "Salut! Je suis Isabella, votre assistante virtuelle chez IbizaGirl.pics 🌴",
                help: "Comment puis-je vous aider?",
                typing: "Isabella tape...",
                send: "Envoyer",
                placeholder: "Tapez votre message...",
                quickActions: [
                    "Voir la galerie premium",
                    "Informations sur les prix",
                    "Comment PayPal fonctionne",
                    "Contenu exclusif"
                ]
            }
        };
        
        this.responses = {
            es: {
                pricing: "💎 Nuestros precios:\n• Fotos premium: €0.10 cada una\n• Videos premium: €0.30 cada uno\n• Suscripción mensual: €9.99\n• Acceso de por vida: €49.99",
                paypal: "💳 PayPal es 100% seguro:\n• Protección del compredor\n• Pagos seguros\n• No guardamos tu información\n• Acceso inmediato después del pago",
                content: "🌴 Contenido exclusivo:\n• 200+ fotos diarias\n• 40+ videos HD\n• Contenido actualizado cada día\n• Calidad premium garantizada",
                help: "🆘 Puedo ayudarte con:\n• Información de precios\n• Proceso de pago\n• Acceso premium\n• Contenido disponible"
            },
            en: {
                pricing: "💎 Our prices:\n• Premium photos: €0.10 each\n• Premium videos: €0.30 each\n• Monthly subscription: €9.99\n• Lifetime access: €49.99",
                paypal: "💳 PayPal is 100% secure:\n• Buyer protection\n• Secure payments\n• We don't store your info\n• Instant access after payment",
                content: "🌴 Exclusive content:\n• 200+ daily photos\n• 40+ HD videos\n• Updated daily\n• Premium quality guaranteed",
                help: "🆘 I can help you with:\n• Pricing information\n• Payment process\n• Premium access\n• Available content"
            },
            fr: {
                pricing: "💎 Nos prix:\n• Photos premium: €0.10 chacune\n• Vidéos premium: €0.30 chacune\n• Abonnement mensuel: €9.99\n• Accès à vie: €49.99",
                paypal: "💳 PayPal est 100% sécurisé:\n• Protection de l'acheteur\n• Paiements sécurisés\n• Nous ne stockons pas vos infos\n• Accès immédiat après paiement",
                content: "🌴 Contenu exclusif:\n• 200+ photos quotidiennes\n• 40+ vidéos HD\n• Mis à jour quotidiennement\n• Qualité premium garantie",
                help: "🆘 Je peux vous aider avec:\n• Informations sur les prix\n• Processus de paiement\n• Accès premium\n• Contenu disponible"
            }
        };

        this.init();
    }

    init() {
        this.createIsabellaButton();
        this.createIsabellaWindow();
        this.setupEventListeners();
        console.log('✅ Isabella AI inicializada correctamente');
    }

    createIsabellaButton() {
        const button = document.createElement('div');
        button.className = 'isabella-chat-container';
        button.innerHTML = `
            <button class="isabella-button" id="isabella-toggle">
                <span class="isabella-icon">🤖</span>
                <span class="isabella-name">Isabella</span>
            </button>
        `;
        document.body.appendChild(button);
    }

    createIsabellaWindow() {
        const window = document.createElement('div');
        window.className = 'isabella-window';
        window.id = 'isabella-window';
        window.innerHTML = `
            <div class="isabella-header">
                <div class="isabella-avatar">
                    <span class="isabella-emoji">🤖</span>
                    <div class="isabella-info">
                        <h4>Isabella AI</h4>
                        <p class="isabella-status">En línea</p>
                    </div>
                </div>
                <button class="isabella-close" id="isabella-close">×</button>
            </div>
            
            <div class="isabella-messages" id="isabella-messages">
                <!-- Messages will be added here -->
            </div>
            
            <div class="isabella-quick-actions" id="isabella-quick-actions">
                <!-- Quick action buttons will be added here -->
            </div>
            
            <div class="isabella-input-area">
                <input type="text" id="isabella-input" placeholder="Escribe tu mensaje...">
                <button id="isabella-send">
                    <span>📩</span>
                </button>
            </div>
        `;
        
        document.querySelector('.isabella-chat-container').appendChild(window);
        this.updateLanguage();
        this.addGreetingMessage();
    }

    setupEventListeners() {
        // Toggle button
        document.getElementById('isabella-toggle').addEventListener('click', () => {
            this.toggleWindow();
        });

        // Close button
        document.getElementById('isabella-close').addEventListener('click', () => {
            this.closeWindow();
        });

        // Send button
        document.getElementById('isabella-send').addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter key
        document.getElementById('isabella-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Language change listener
        document.addEventListener('languageChanged', (e) => {
            this.currentLanguage = e.detail.language;
            this.updateLanguage();
        });
    }

    toggleWindow() {
        const window = document.getElementById('isabella-window');
        this.isOpen = !this.isOpen;
        window.style.display = this.isOpen ? 'flex' : 'none';
        
        if (this.isOpen && this.messages.length === 0) {
            this.addGreetingMessage();
        }
    }

    closeWindow() {
        this.isOpen = false;
        document.getElementById('isabella-window').style.display = 'none';
    }

    updateLanguage() {
        const lang = this.languages[this.currentLanguage];
        
        // Update placeholder
        const input = document.getElementById('isabella-input');
        if (input) input.placeholder = lang.placeholder;
        
        // Update quick actions
        this.updateQuickActions();
        
        // Update status
        const status = document.querySelector('.isabella-status');
        if (status) status.textContent = 'Online';
    }

    updateQuickActions() {
        const container = document.getElementById('isabella-quick-actions');
        const lang = this.languages[this.currentLanguage];
        
        if (container && lang.quickActions) {
            container.innerHTML = lang.quickActions.map(action => 
                `<button class="quick-btn" onclick="window.IsabellaAI.handleQuickAction('${action}')">${action}</button>`
            ).join('');
        }
    }

    addGreetingMessage() {
        const lang = this.languages[this.currentLanguage];
        this.addMessage('ai', lang.greeting);
        this.addMessage('ai', lang.help);
    }

    sendMessage() {
        const input = document.getElementById('isabella-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addMessage('user', message);
        input.value = '';
        
        // Show typing indicator
        this.showTyping();
        
        // Generate response
        setTimeout(() => {
            this.hideTyping();
            const response = this.generateResponse(message);
            this.addMessage('ai', response);
        }, 1500);
    }

    addMessage(type, content) {
        const messagesContainer = document.getElementById('isabella-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `isabella-message ${type}-message`;
        
        const time = new Date().toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageDiv.innerHTML = `
            <div class="message-content">${content}</div>
            <div class="message-time">${time}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.messages.push({ type, content, time });
    }

    showTyping() {
        const messagesContainer = document.getElementById('isabella-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'isabella-message ai-message typing-message';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    }

    generateResponse(message) {
        const msg = message.toLowerCase();
        const responses = this.responses[this.currentLanguage];
        
        if (msg.includes('precio') || msg.includes('price') || msg.includes('prix') || msg.includes('cost')) {
            return responses.pricing;
        }
        
        if (msg.includes('paypal') || msg.includes('pago') || msg.includes('payment') || msg.includes('paiement')) {
            return responses.paypal;
        }
        
        if (msg.includes('contenido') || msg.includes('content') || msg.includes('contenu') || msg.includes('video') || msg.includes('foto')) {
            return responses.content;
        }
        
        if (msg.includes('ayuda') || msg.includes('help') || msg.includes('aide')) {
            return responses.help;
        }
        
        // Default responses
        const defaultResponses = {
            es: [
                "¡Interesante! 🤔 ¿Te gustaría saber más sobre nuestro contenido premium?",
                "¡Perfecto! 😊 ¿Hay algo específico en lo que pueda ayudarte?",
                "¡Genial! 🌟 ¿Quieres que te explique cómo funciona nuestra plataforma?",
                "¡Excelente pregunta! 💡 ¿Te interesa algún tipo de contenido en particular?"
            ],
            en: [
                "Interesting! 🤔 Would you like to know more about our premium content?",
                "Perfect! 😊 Is there something specific I can help you with?",
                "Great! 🌟 Would you like me to explain how our platform works?",
                "Excellent question! 💡 Are you interested in any particular type of content?"
            ],
            fr: [
                "Intéressant! 🤔 Aimeriez-vous en savoir plus sur notre contenu premium?",
                "Parfait! 😊 Y a-t-il quelque chose de spécifique avec lequel je peux vous aider?",
                "Génial! 🌟 Voulez-vous que j'explique comment fonctionne notre plateforme?",
                "Excellente question! 💡 Êtes-vous intéressé par un type de contenu particulier?"
            ]
        };
        
        const responses_array = defaultResponses[this.currentLanguage];
        return responses_array[Math.floor(Math.random() * responses_array.length)];
    }

    handleQuickAction(action) {
        this.addMessage('user', action);
        
        setTimeout(() => {
            let response = '';
            const responses = this.responses[this.currentLanguage];
            
            if (action.includes('precio') || action.includes('pricing') || action.includes('prix')) {
                response = responses.pricing;
            } else if (action.includes('premium') || action.includes('galería') || action.includes('gallery')) {
                response = responses.content;
            } else if (action.includes('PayPal')) {
                response = responses.paypal;
            } else {
                response = responses.help;
            }
            
            this.addMessage('ai', response);
        }, 800);
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        this.updateLanguage();
    }
}

// Initialize Isabella when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.IsabellaAI = new IsabellaAI();
});

console.log('✅ Isabella AI script cargado completamente');