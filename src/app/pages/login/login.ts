import { Component } from '@angular/core';
import { LeftSide } from './components/left-side/left-side';
import { RightSide } from './components/right-side/right-side';
@Component({
  selector: 'app-login',
  imports: [LeftSide, RightSide],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

}
