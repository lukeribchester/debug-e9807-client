import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { ConnectionStatus, WebSocketService } from './core/services/web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public form!: FormGroup;

  constructor(private formBuilder: FormBuilder, public webSocketService: WebSocketService) {
  }

  ngOnInit(): void {
    // Log the WebSocket connection status.
    this.webSocketService.status$.subscribe((status: ConnectionStatus) => {
      console.warn('[WebSocketService] Connection status:', status)
    });

    this.form = this.formBuilder.group({
      address: [undefined, [
        Validators.required
      ]]
    });
  }

  public get address() {
    return this.form.get('address');
  }

  public connect(): void {
    this.webSocketService.initialise(this.address?.value);
  }

  public send(): void {
    this.webSocketService.send({
      id: uuidv4()
    });
  }
}
