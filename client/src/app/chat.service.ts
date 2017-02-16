import { Injectable } from '@angular/core';
import * as io from "socket.io-client";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ChatService {
  socket : any;
  userName : string;

  // list of rooms current user has created
  myRooms : string[] = [];

  constructor() { 
    this.socket = io("http://localhost:8080/");

    this.socket.on("connect", function(){
      console.log("connect");
    });
  }

  login(userName: string) : Observable<boolean> {
    let observable = new Observable( observer => {
        this.socket.emit("adduser", userName, succeeded => {
          if(succeeded === true) {
            this.userName = userName;
            observer.next(succeeded);
          }
          
        });
    });

    return observable;
  }

  logout() {
    this.socket.emit("disconnect");
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

  getOnlineUsers() : Observable<string[]> {
    let obs = new Observable(observer => {
      this.socket.emit("users");
      this.socket.on("userlist", (users) => {

        let strArr: string[] = [];
        for(var u in users) {
          // dont return the current user
          if(users[u] !== this.userName) {
            strArr.push(users[u]);
          }
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

  isCreator() : Observable<boolean> {
    let observable = new Observable( observer => {
      this.socket.on("updateusers", (roomName, users, ops) => {
        let creator = false;

        for(var u in ops) {
          // dont return the current user
          if(ops[u] === this.userName) {
            creator = true;
            this.myRooms.push(roomName);
          }
        }

        if(creator === false) {
          for(var r in this.myRooms) {
            if(roomName === this.myRooms[r]) {
              creator = true;
            }
          }
        }
          
        observer.next(creator);

      });
    });
    return observable;
  }

  leaveRoom(roomName : string) {
    this.socket.emit("partroom", roomName);
  }

  getMessages() : Observable<Object[]> {
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

  // get all the users in the room current user is
  getUsers() : Observable<string[]> {
    let observable = new Observable( observer => {
      this.socket.on("updateusers", (roomName, users, ops) => {

        let strArr: string[] = [];
        for(var u in users) {
          // dont return the current user
          if(users[u] !== this.userName) {
            strArr.push(users[u]);
          }
        }

        observer.next(strArr);
      });
    });
    return observable;
  }


}
