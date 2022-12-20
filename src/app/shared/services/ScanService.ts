import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import 'rxjs/add/operator/map'


import { WebsocketService } from "./WebsocketService";

const SCAN_URL = "ws://localhost:8181/";

export interface Message {

  data: any;
}

@Injectable()
export class ScanService {
  public messages: Subject<Message>;

  constructor(wsService: WebsocketService) {
    this.messages = <Subject<Message>>wsService.connect(SCAN_URL).map(
      (response: MessageEvent): Message => {
        let data =response;  
        return {
        
          data: data
        };
      }
    );
  }
}