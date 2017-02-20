import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import {ToastModule, ToastOptions} from 'ng2-toastr/ng2-toastr';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomComponent } from './room/room.component';
import { ChatService } from './chat.service';
import { ToastComponent } from './toast/toast.component';
import { UserComponent } from './user/user.component';

const options: ToastOptions = new ToastOptions({
  animate: 'flyRight',
  positionClass: 'toast-bottom-right',
});

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RoomListComponent,
    RoomComponent,
    ToastComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ToastModule.forRoot(),
    RouterModule.forRoot([{
      path: '',
      redirectTo: 'login',
      pathMatch: 'full'
    }, {
      path: 'login',
      component: LoginComponent
    },
    {
      path: 'rooms',
      component: RoomListComponent
    },
    {
      path: 'rooms/:id',
      component: RoomComponent
    },
    {
      path: 'toast',
      component: ToastComponent
    },
    {
      path: 'users/:id',
      component: UserComponent
    }])
  ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }


