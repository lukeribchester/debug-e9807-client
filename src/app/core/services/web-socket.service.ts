import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { WebSocketSubject } from 'rxjs/internal-compatibility';
import { webSocket } from 'rxjs/webSocket';

export enum ConnectionStatus {
  Open = 'Open',
  Closing = 'Closing',
  Closed = 'Closed'
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private readonly statusSubject$: BehaviorSubject<ConnectionStatus>;
  public readonly status$: Observable<ConnectionStatus>;

  private readonly messageSubject$: Subject<unknown>;
  public readonly message$: Observable<unknown>;

  private socket: WebSocketSubject<unknown> | undefined;

  constructor() {
    this.statusSubject$ = new BehaviorSubject<ConnectionStatus>(ConnectionStatus.Closed);
    this.status$ = this.statusSubject$.asObservable();

    this.messageSubject$ = new Subject<unknown>();
    this.message$ = this.messageSubject$.asObservable();

    this.socket = undefined;
  }

  public initialise(url: string): void {
    console.warn(`[WebSocketService] Initialising (${url})`);

    this.socket = webSocket({
      url: url,
      openObserver: {
        next: () => this.statusSubject$.next(ConnectionStatus.Open)
      },
      closingObserver: {
        next: () => this.statusSubject$.next(ConnectionStatus.Closing)
      },
      closeObserver: {
        next: () => this.statusSubject$.next(ConnectionStatus.Closed)
      }
    });

    this.socket.subscribe({
      next: (message: unknown) => {
        console.debug('[WebSocketService] Message received:');
        console.debug(message);
      },
      error: (error: unknown) => {
        console.error('[WebSocketService] Error received:');
        console.error(error);
      },
      complete: () => console.warn('[WebSocketService] WebSocket closed.')
    });
  }

  public send(message: unknown): void {
    try {
      this.socket?.next(message);
      console.debug('[WebSocketService] Message sent:', message);
    } catch (error) {
      console.error('[WebSocketService] An error occurred while sending a message:', error);
      throw new Error(error);
    }
  }
}
