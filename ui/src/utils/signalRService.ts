import { HubConnection, HubConnectionBuilder, LogLevel, HubConnectionState } from '@microsoft/signalr';
import { IMessage } from '../config/applicatonConfig';
import { BASE_URL } from '../constrants';

export class SignalRService {
  private connection: HubConnection | null = null;
  private messageCallbacks: ((message: IMessage) => void)[] = [];
  private typingCallbacks: ((username: string) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  public async startConnection(): Promise<void> {
    try {
      if (this.connection?.state === HubConnectionState.Connected) {
        return;
      }

      this.connection = new HubConnectionBuilder()
        .withUrl(`${BASE_URL}/hub`, {
          withCredentials: true
        })
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: retryContext => {
            if (retryContext.previousRetryCount === this.maxReconnectAttempts) {
              return null; // Stop retrying
            }
            return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
          }
        })
        .build();

      this.connection.onreconnecting(() => {
        console.log('Attempting to reconnect...');
        this.reconnectAttempts++;
      });

      this.connection.onreconnected(() => {
        console.log('Reconnected successfully');
        this.reconnectAttempts = 0;
      });

      this.connection.onclose(() => {
        console.log('Connection closed');
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.startConnection();
        }
      });

      await this.connection.start();
      this.registerHandlers();
      console.log('SignalR Connected');
    } catch (err) {
      console.error('SignalR Connection Error: ', err);
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => this.startConnection(), 5000);
      }
    }
  }

  public async ensureConnection(): Promise<void> {
    if (!this.connection || this.connection.state !== HubConnectionState.Connected) {
      await this.startConnection();
    }
  }

  private registerHandlers(): void {
    if (!this.connection) return;

    this.connection.on('ReceiveMessage', (senderId: string, message: string) => {
      this.messageCallbacks.forEach(callback => 
        callback({ 
          id: 0,
          message_from: parseInt(senderId),
          message_to: 0,
          content: message,
          created_at: new Date().toISOString(),
          conversation_id: 0
        } as IMessage)
      );
    });

    this.connection.on('UserTyping', (username: string) => {
      this.typingCallbacks.forEach(callback => callback(username));
    });
  }

  public async joinConversation(conversationId: string): Promise<void> {
    await this.ensureConnection();
    if (this.connection?.state === HubConnectionState.Connected) {
      await this.connection.invoke('AddToGroup', conversationId);
    }
  }

  public async leaveConversation(conversationId: string): Promise<void> {
    try {
      await this.ensureConnection();
      if (this.connection?.state === HubConnectionState.Connected) {
        await this.connection.invoke("LeaveGroup", conversationId);
        console.log(`Left conversation ${conversationId}`);
      }
    } catch (error) {
      console.error('Error leaving conversation:', error);
      throw error;
    }
  }

  public async sendMessage(conversationId: string, message: string): Promise<void> {
    if (!this.connection) return;
    console.log(`${conversationId} ${message}`)
    await this.connection.invoke('SendMessage', conversationId, message);
  }

  public async userTyping(conversationId: string, username: string): Promise<void> {
    if (!this.connection) return;
    await this.connection.invoke('UserTyping', conversationId, username);
  }

  public onReceiveMessage(callback: (message: IMessage) => void): void {
    this.messageCallbacks.push(callback);
  }

  public onUserTyping(callback: (username: string) => void): void {
    this.typingCallbacks.push(callback);
  }

  public async stopConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }
}

export const signalRService = new SignalRService();