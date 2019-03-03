import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ChatComponent } from './pages/chat/chat.component';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: '/login'},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},  
  {path: 'chat', component: ChatComponent, canActivate: [AuthGuard], // The AuthGuard Prevents to go to the chat page if we arent logged
  children: [
    { path: '', component: ChatComponent },
    { path: ':chatroomId', component: ChatComponent }    // Set the url with the id of the chatrooms 
  ]
},
  {path: '**', redirectTo: '/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
