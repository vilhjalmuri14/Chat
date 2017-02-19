import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ChatService } from "../chat.service";
import { ActivatedRoute, Params }   from '@angular/router';
import { Router } from "@angular/router";

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

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

  constructor(private chatService: ChatService, private route: ActivatedRoute, 
              private router: Router, public toastr: ToastsManager, vcr: ViewContainerRef) { 
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {

    this.route.params.subscribe(p => {
      // get the id variable from the url
      this.roomName = p['id'];

      //try to join the 
      this.chatService.joinRoom(this.roomName).subscribe(succeeded => {
        if(!succeeded) {
          // if you could not connect to the room then 
          // user is redirected to room list page
          this.chatService.leaveRoom(this.roomName);
          this.router.navigate(["/rooms"]);
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

          this.chatService.gotKicked().subscribe(succeeded => {
            // if user is kicked out of the room he goes to room list page
            if(succeeded === true) {
              this.chatService.leaveRoom(this.roomName);
              this.router.navigate(["/rooms"]);
            }
          });      
        }
      });

    });
  }

  sendMessage() {
    this.chatService.sendMessage(this.roomName, this.newMessage).subscribe(succeeded => {
      if(!succeeded) {
        this.toastr.error("Could not send message!", 'Error!');
      }
    });

    this.newMessage = "";
  }

  leaveRoom() {
    this.chatService.leaveRoom(this.roomName);
  
    this.router.navigate(["/rooms"]);
  }

  banUser(user : string) {
    this.chatService.banUser(user, this.roomName).subscribe(succeeded => {
      if(!succeeded) {
        this.toastr.error("Could not ban " + user + " from room!", 'Error!');
      }
      else {
        this.toastr.success(user + " was banned from the room!", "Kicked!");
      }
    });
  }

  kickUser(user : string) {
    this.chatService.kickUser(user, this.roomName).subscribe(succeeded => {
      if(!succeeded) {
        this.toastr.error("Could not kick " + user + " from room!", 'Error!');
      }
      else {
        this.toastr.success(user + " was kicked from the room!", "Kicked!");
      }
    });
  }
}
