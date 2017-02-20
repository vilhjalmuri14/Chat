import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  // the user current user is chatting whith
  user: string;

  newMessage: string;
  messages: Object[] = [];

  constructor(private chatService: ChatService, private route: ActivatedRoute,
              private router: Router, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {

    this.route.params.subscribe(p => {
      // get the id variable from the url
      this.user = p['id'];

      this.messages = this.chatService.getAllMessagesFromUser(this.user);

      // Get all the messages from user
      this.chatService.recievePrivateMessages().subscribe(msgObj => {
        this.messages = this.chatService.getAllMessagesFromUser(this.user);
      });

    });
  }

  leaveUser() {
    this.router.navigate(['/rooms']);
  }

  scrollToBottom(id) {
    const element = document.getElementById(id);
    element.scrollTop = element.scrollHeight - element.clientHeight;
  }

  sendMessage() {
    this.chatService.sendPrivateMessageToUser(this.user, this.newMessage).subscribe(succeeded => {
      if (!succeeded) {
        // todo send toaster
      } else {
        // refresh the chat
        this.messages = this.chatService.getAllMessagesFromUser(this.user);
      }
    });
    this.newMessage = '';
  }
}
