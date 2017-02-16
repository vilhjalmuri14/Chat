import { Component, OnInit } from '@angular/core';
import { ChatService } from "../chat.service";
import { ActivatedRoute, Params }   from '@angular/router';
import { Router } from "@angular/router";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  roomName : string;
  newMessage : string;
  messages : Object[];
  users : Object[];

  // if current user is the creator of the room
  isCreator : boolean = false;

  constructor(private chatService: ChatService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

    this.route.params.subscribe(p => {
      // get the id variable from the url
      this.roomName = p['id'];

      //try to join the 
      this.chatService.joinRoom(this.roomName).subscribe(succeeded => {
        if(!succeeded) {
          // TODO show error messages could not connect
        }
        else {

          // Get all the messages
          this.chatService.getMessages().subscribe(lst => {
            this.messages = lst;
          });

          // Get the users in the room
          this.chatService.getUsers().subscribe(lst => {
            this.users = lst;
          });

          this.chatService.isCreator().subscribe(succeeded => {
            this.isCreator = succeeded;
          });          
        }
      });

    });
  }

  sendMessage() {
    this.chatService.sendMessage(this.roomName, this.newMessage).subscribe(succeeded => {
      if(!succeeded) {
        // TODO show error message
      }
    });

    this.newMessage = "";
  }

  leaveRoom() {
    this.chatService.leaveRoom(this.roomName);
  
    this.router.navigate(["/rooms"]);
  }
}
