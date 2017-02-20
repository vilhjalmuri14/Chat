import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {

  rooms: string[];
  newRoomName: string;
  users: string[];

  constructor(private chatService: ChatService, private router: Router,
              public toastr: ToastsManager, vcr: ViewContainerRef) {
      this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.chatService.getRoomList().subscribe(lst => {
      this.rooms = lst;
    });

    this.chatService.getOnlineUsers().subscribe(lst => {
      this.users = lst;
    });

    this.chatService.recievePrivateMessages().subscribe(msgObj => {
      this.toastr.success(msgObj.message, 'Message from ' + msgObj.nick);
    });
  }

  createRoom() {
    if (this.newRoomName) {
      this.router.navigate(['/rooms', this.newRoomName]);
    }
  }

}
