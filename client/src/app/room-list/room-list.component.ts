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

  constructor(private chatService: ChatService, private router: Router,
              public toastr: ToastsManager, vcr: ViewContainerRef) {
      this.toastr.setRootViewContainerRef(vcr);
  }

  rooms: string[];
  newRoomName: string;
  users: string[];

  ngOnInit() {
    this.chatService.getRoomList().subscribe(lst => {
      this.rooms = lst;
    });

    this.chatService.getOnlineUsers().subscribe(lst => {
      this.users = lst;
    });

    this.chatService.recievePrivateMessages().subscribe(msgObj => {
      // Show toaster
    });
  }

  createRoom() {
    if (this.newRoomName) {
      this.router.navigate(['/rooms', this.newRoomName]);
    }
  }

}
