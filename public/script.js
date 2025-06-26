class WebSocketChat {
    constructor() {
        this.ws = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.clientId = this.generateClientId();
        
        this.initializeElements();
        this.bindEvents();
        this.connect();
    }

    generateClientId() {
        // Simple random client ID for session
        return 'client-' + Math.random().toString(36).substr(2, 9);
    }

    initializeElements() {
        this.statusElement = document.getElementById('status');
        this.messagesElement = document.getElementById('messages');
        this.usernameInput = document.getElementById('username');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
    }

    bindEvents() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        this.usernameInput.addEventListener('input', () => {
            this.updateSendButtonState();
        });

        this.messageInput.addEventListener('input', () => {
            this.updateSendButtonState();
        });

        // Handle page visibility change for reconnection
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && !this.isConnected) {
                this.connect();
            }
        });
    }

    connect() {
        try {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${protocol}//${window.location.host}`;
            
            this.ws = new WebSocket(wsUrl);
            
            this.ws.onopen = () => {
                console.log('WebSocket connected');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.updateConnectionStatus('Connected', 'status-connected');
                this.updateSendButtonState();
            };

            this.ws.onmessage = (event) => {
                this.handleMessage(event.data);
            };

            this.ws.onclose = (event) => {
                console.log('WebSocket disconnected:', event.code, event.reason);
                this.isConnected = false;
                this.updateConnectionStatus('Disconnected', 'status-disconnected');
                this.updateSendButtonState();
                
                // Attempt to reconnect if not a normal closure
                if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.scheduleReconnect();
                }
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.updateConnectionStatus('Error', 'status-disconnected');
            };

        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
            this.updateConnectionStatus('Error', 'status-disconnected');
        }
    }

    scheduleReconnect() {
        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
        
        console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
        
        setTimeout(() => {
            if (!this.isConnected) {
                this.connect();
            }
        }, delay);
    }

    handleMessage(data) {
        try {
            const message = JSON.parse(data);
            if (message.type === 'message') {
                // Only show as 'other-message' if not from this client
                if (message.clientId && message.clientId === this.clientId) return;
                this.displayMessage(message.user, message.message, message.timestamp, 'other-message');
            } else if (message.type === 'system') {
                this.displayMessage('System', message.message, message.timestamp, 'system-message');
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    }

    sendMessage() {
        if (!this.isConnected || !this.messageInput.value.trim()) {
            return;
        }

        const username = this.usernameInput.value.trim() || 'Anonymous';
        const message = this.messageInput.value.trim();

        const messageData = {
            user: username,
            message: message,
            clientId: this.clientId
        };

        try {
            this.ws.send(JSON.stringify(messageData));
            
            // Display own message only as 'user-message'
            this.displayMessage(username, message, new Date().toISOString(), 'user-message');
            
            // Clear input
            this.messageInput.value = '';
            this.updateSendButtonState();
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.displayMessage('System', 'Failed to send message', new Date().toISOString(), 'system-message');
        }
    }

    displayMessage(user, message, timestamp, messageClass) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${messageClass}`;
        
        const time = new Date(timestamp).toLocaleTimeString();
        
        messageElement.innerHTML = `
            <div class="message-header">${user} • ${time}</div>
            <div class="message-content">${this.escapeHtml(message)}</div>
        `;
        
        this.messagesElement.appendChild(messageElement);
        this.scrollToBottom();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    scrollToBottom() {
        this.messagesElement.scrollTop = this.messagesElement.scrollHeight;
    }

    updateConnectionStatus(status, className) {
        this.statusElement.textContent = status;
        this.statusElement.className = className;
    }

    updateSendButtonState() {
        const hasUsername = this.usernameInput.value.trim().length > 0;
        const hasMessage = this.messageInput.value.trim().length > 0;
        const canSend = this.isConnected && hasUsername && hasMessage;
        
        this.sendButton.disabled = !canSend;
    }
}

// Initialize the chat when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WebSocketChat();
}); 