import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChatService {
  socket: any;
  userName: string;

  // list of rooms current user has created
  myRooms: Object[] = [];

  myMessages: { [id: string]: Object[] } = {};

  constructor() {
    this.socket = io('http://localhost:8080/');

    this.socket.on('connect', function(){
      console.log('connect');
    });
  }

  login(userName: string): Observable<boolean> {
    const observable = new Observable( observer => {
        this.socket.emit('adduser', userName, succeeded => {
          if (succeeded === true) {
            this.userName = userName;
            observer.next(succeeded);
          }
        });
    });

    return observable;
  }

  logout() {
    this.socket.emit('disconnect');
  }

  getRoomList(): Observable<string[]> {
    const obs = new Observable(observer => {
      this.socket.emit('rooms');
      this.socket.on('roomlist', (lst) => {

        const strArr: string[] = [];
        for (const x in lst) {
          strArr.push(x);
        }

        observer.next(strArr);
      });
    });
    return obs;
  }

  getOnlineUsers(): Observable<string[]> {
    const obs = new Observable(observer => {
      this.socket.emit('users');
      this.socket.on('userlist', (users) => {

        const strArr: string[] = [];
        for (const u in users) {
          // dont return the current user
          if (users[u] !== this.userName) {
            strArr.push(users[u]);
          }
        }

        observer.next(strArr);
      });
    });
    return obs;
  }

  joinRoom(roomName: string): Observable<boolean> {
    const roomObj = {
        room: roomName,
        pass: undefined
    };

    const observable = new Observable( observer => {
      this.socket.emit('joinroom', roomObj, (succeeded, message) => {
        observer.next(succeeded);
      });
    });

    return observable;
  }

  isCreator(): Observable<boolean> {
    const observable = new Observable( observer => {
      this.socket.on('updateusers', (roomName, users, ops) => {
        const creator = false;

        for (const u in ops) {
          if (ops[u] === this.userName) {
            creator = true;
            this.myRooms.push(roomName);
          }
        }
        /*
        if (creator === false) {
          for (var r in this.myRooms) {
            if (roomName === this.myRooms[r]) {
              creator = true;
            }
          }
        }*/
        observer.next(creator);
      });
    });
    return observable;
  }

  leaveRoom(roomName: string) {
    this.socket.emit('partroom', roomName);
  }

  getMessages(): Observable<Object[]> {
    const observable = new Observable( observer => {
      this.socket.on('updatechat', (roomName, messageHistory) => {
        observer.next(messageHistory);
      });
    });
    return observable;
  }

  sendMessage(roomName: string, message: string): Observable<boolean> {
    const msgObj = {
      roomName: roomName,
      msg: message
    };

    const observable = new Observable( observer => {
      this.socket.emit('sendmsg', msgObj, (succeeded) => {
        observer.next(succeeded);
      });
    });

    return observable;
  }

  // get all the users in the room current user is
  getUsers(): Observable<string[]> {
    const observable = new Observable( observer => {
      this.socket.on('updateusers', (roomName, users, ops) => {

<<<<<<< HEAD
        let strArr: string[] = [];
        for(var u in users) {
          strArr.push(users[u]);
=======
        const strArr: string[] = [];
        for (const u in users) {
          // dont return the current user
          if (users[u] !== this.userName) {
            strArr.push(users[u]);
          }
>>>>>>> 59828ed466c9c942cb889b73d47e0f047f215a24
        }

        observer.next(strArr);
      });
    });
    return observable;
  }

  kickUser(user: string, roomName: string): Observable<boolean> {
    const kickObj = {
      room: roomName,
      user: user
    };

    const observable = new Observable( observer => {
      this.socket.emit('kick', kickObj, (succeeded) => {
        observer.next(succeeded);
      });
    });

    return observable;
  }

  // returns true if current user just got kicked
  gotKicked(): Observable<boolean> {
    const observable = new Observable( observer => {
      this.socket.on('kicked', (roomName, kickedUser, roomOwner) => {
        if (kickedUser === this.userName) {
          observer.next(true);
        }
      });
    });
    return observable;
  }

  banUser(user: string, roomName: string): Observable<boolean> {
    const banObj = {
      room: roomName,
      user: user
    };

    const observable = new Observable( observer => {
      this.socket.emit('ban', banObj, (succeeded) => {
        observer.next(succeeded);
      });
    });

    return observable;
  }

  // returns true if current user just got banned
  gotBanned(): Observable<boolean> {
    const observable = new Observable( observer => {
      this.socket.on('banned', (roomName, bannedUser, roomOwner) => {
        if (bannedUser === this.userName) {
          observer.next(true);
        }
      });
    });
    return observable;
  }

  getAllMessagesFromUser(user: string): Object[] {
    return this.myMessages[user];
  }

  sendPrivateMessageToUser(user: string, message: string): Observable<boolean> {
    const msgObj = {
      nick: user,
      message: message
    };

    const observable = new Observable( observer => {
      this.socket.emit('privatemsg', msgObj, (succeeded) => {

        this.addToMyMessages(user,this.userName, message);
        
        observer.next(succeeded);
      });
    });
    return observable;
  }

  recievePrivateMessages(): Observable<Object> {

    let observable = new Observable( observer => {
      this.socket.on("recv_privatemsg", (fromUser, message) => {

        let msgObj = {
          nick: fromUser,
          message: message
        };

        this.addToMyMessages(fromUser,fromUser, message);

        observer.next(msgObj);
      });
    });
    return observable;
  }

  // helper function to keep track of messages
  addToMyMessages(user : string, FromUser : string, message : string) {

    let msgObj = {
      nick: FromUser,
      message: message
    };

    if(this.myMessages[user] === undefined) {
      this.myMessages[user] = [];
      this.myMessages[user].push(msgObj);
    }
    else {
      let lastMessage: any = this.myMessages[user].pop();
      
      if(lastMessage.nick !== msgObj.nick && lastMessage.message !== msgObj.message) {
        this.myMessages[user].push(lastMessage);
        this.myMessages[user].push(msgObj);
      }
      else {
        this.myMessages[user].push(lastMessage);
      }
    }
  }


}
