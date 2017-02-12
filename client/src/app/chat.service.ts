import { Injectable } from '@angular/core';
import * as io from "socket.io-client";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ChatService {
  socket : any;

  constructor() { 
    this.socket = io("http://localhost:8080/");

    this.socket.on("connect", function(){
      console.log("connect");
    });
  }

  login(userName: string) : Observable<boolean> {
    let observable = new Observable( observer => {
        this.socket.emit("adduser", userName, succeeded => {
          observer.next(succeeded);
        });
    });

    return observable;
  }

  getRoomList() : Observable<string[]> {
    let obs = new Observable(observer => {
      this.socket.emit("rooms");
      this.socket.on("roomlist", (lst) => {

        let strArr: string[] = [];
        for(var x in lst) {
          strArr.push(x);
        }

        observer.next(strArr);
      })
    });
    return obs;
  }

  joinRoom(roomName : string) : Observable<boolean> {
    let roomObj = {
        room : roomName,
        pass : undefined
    };

    let observable = new Observable( observer => {
      this.socket.emit("joinroom", roomObj, (succeeded, message) => {
          observer.next(succeeded);
      });
    });

    return observable;
  }

  getMessages(roomName : string) : Observable<Object[]> {
    let observable = new Observable( observer => {
      this.socket.on("updatechat", (roomName,messageHistory) => {
        observer.next(messageHistory);
      });
    });
    return observable;
  }

  sendMessage(roomName : string, message : string) : Observable<boolean> {
    let msgObj = {
      roomName : roomName,
      msg : message
    };

    let observable = new Observable( observer => {
      this.socket.emit("sendmsg", msgObj, (succeeded) => {
        observer.next(succeeded);
      });
    });

    return observable;
  }


}
