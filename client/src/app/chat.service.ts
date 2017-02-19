import { Injectable } from '@angular/core';
import * as io from "socket.io-client";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ChatService {
  socket : any;
  userName : string;

  // list of rooms current user has created
  myRooms : Object[] = [];

  // 
  myMessages : { [id : string] : Object[] } = {};

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
          if(ops[u] === this.userName) {
            creator = true;
            this.myRooms.push(roomName);
          }
        }

        /*
        if(creator === false) {
          for(var r in this.myRooms) {
            if(roomName === this.myRooms[r]) {
              creator = true;
            }
          }
        }*/
          
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

  kickUser(user : string, roomName : string) : Observable<boolean> {
    let kickObj = {
      room : roomName,
      user : user
    };

    let observable = new Observable( observer => {
      this.socket.emit("kick", kickObj, (succeeded) => {
        observer.next(succeeded);
      });
    });

    return observable;
  }

  // returns true if current user just got kicked
  gotKicked() : Observable<boolean> {
    let observable = new Observable( observer => {
      this.socket.on("kicked", (roomName,kickedUser,roomOwner) => {
        if(kickedUser === this.userName) {
          observer.next(true);
        }
      });
    });
    return observable;
  }

  banUser(user : string, roomName : string) : Observable<boolean> {
    let banObj = {
      room : roomName,
      user : user
    };

    let observable = new Observable( observer => {
      this.socket.emit("ban", banObj, (succeeded) => {
        observer.next(succeeded);
      });
    });

    return observable;
  }

  // returns true if current user just got banned
  gotBanned() : Observable<boolean> {
    let observable = new Observable( observer => {
      this.socket.on("banned", (roomName,bannedUser,roomOwner) => {
        if(bannedUser === this.userName) {
          observer.next(true);
        }
      });
    });
    return observable;
  }

  getAllMessagesFromUser(user : string) : Object[] {
    return this.myMessages[user]
  }

  sendPrivateMessageToUser(user : string, message : string) : Observable<boolean> {
    let msgObj = {
      nick : user,
      message : message
    };

    let observable = new Observable( observer => {
      this.socket.emit("privatemsg", msgObj, (succeeded) => {

        let storeObj = {
          nick : this.userName,
          message : message
        };

        if(this.myMessages[user] === undefined) {
          this.myMessages[user] = [];
          this.myMessages[user].push(storeObj);
        }
        else {
          this.myMessages[user].push(storeObj);
        }
        
        observer.next(succeeded);
      });
    });

    return observable;
  }

  recievePrivateMessages() : Observable<Object> {

    let observable = new Observable( observer => {
      this.socket.on("recv_privatemsg", (fromUser, message) => {
        
        let msgObj = {
          nick: fromUser,
          message: message
        };

        if(this.myMessages[fromUser] === undefined) {
          this.myMessages[fromUser] = [];
          this.myMessages[fromUser].push(msgObj);
        }
        else {
          this.myMessages[fromUser].push(msgObj);
        }

        observer.next(msgObj);
      });
    });

    return observable;
  }


}
