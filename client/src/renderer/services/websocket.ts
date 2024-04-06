const { checkAndRefreshTokens } = require('./tokens');

type WebSocketMessage = {
  type: 'invoice_update' | 'execution_logs';
  data: any;
};

export default class WebSocketService {
  private socket: WebSocket | null = null;

  private reconnectInterval: NodeJS.Timeout | null = null;

  private reconnectAttempts = 0;

  private messageListeners: Record<string, (data: any) => void> = {};

  public on(messageType: string, callback: (data: any) => void): void {
    this.messageListeners[messageType] = callback;
  }

  public off(messageType: string): void {
    delete this.messageListeners[messageType];
  }

  public async connect(url: string): Promise<void> {
    const result = await checkAndRefreshTokens();

    const encodedToken = encodeURIComponent(result?.data || '');

    this.socket = new WebSocket(`${url}?token=${encodedToken}`);

    this.socket.onopen = () => {
      console.log('WebSocket connection opened');
      this.reconnectAttempts = 0;
      if (this.reconnectInterval) {
        clearInterval(this.reconnectInterval);
        this.reconnectInterval = null;
      }
    };

    this.socket.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      if (this.messageListeners[message.type]) {
        this.messageListeners[message.type](message.data);
      } else {
        console.error('No listener registered for message type:', message.type);
      }
    };

    this.socket.onclose = (event) => {
      if (event.code === 1000) {
        console.log('WebSocket connection closed');
        return;
      }
      if (event.code === 1008) {
        window.electron.store.delete('accessToken');
        window.electron.store.delete('refreshToken');
        window.location.hash = '#login';
        return;
      }
      if (this.reconnectInterval) {
        clearTimeout(this.reconnectInterval);
        this.reconnectInterval = null;
      }
      const delay =
        (this.reconnectAttempts < 5 ? 2 ** this.reconnectAttempts : 60) * 1000;

      this.reconnectInterval = setTimeout(async () => {
        this.reconnectAttempts += 1;
        await this.connect(url);
        this.reconnectInterval = null;
      }, delay);
    };

    this.socket.onerror = (event) => {
      console.error('WebSocket error:', event);
    };
  }

  public isConnected(): boolean {
    return this.socket ? this.socket.readyState === WebSocket.OPEN : false;
  }

  public send(data: string): void {
    if (!this.socket) {
      console.error('Must connect to WebSocket before sending data');
      return;
    }

    this.socket.send(data);
  }

  public disconnect(): void {
    if (!this.socket) {
      console.error('Must connect to WeboScket before disconnecting');
      return;
    }

    this.socket.close(1000, 'Normal closure');
  }
}
