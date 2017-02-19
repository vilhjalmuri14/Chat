import { Component, OnInit } from '@angular/core';
import { ChatService } from "../chat.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {

  constructor(private chatService: ChatService, private router: Router) { }

  rooms: string[];
  newRoomName : string;
  users: string[];

  ngOnInit() {
    this.chatService.getRoomList().subscribe(lst => {
      this.rooms = lst;
    });

    this.chatService.getOnlineUsers().subscribe(lst => {
      this.users = lst;
    });
  }

  createRoom() {
    if(this.newRoomName) {
      this.router.navigate(["/rooms", this.newRoomName]);
    }
  }

}
