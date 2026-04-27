import { Component } from '@angular/core';
import { LeftSide } from './components/left-side/left-side';
import { RightSide } from '../login/components/right-side/right-side';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [LeftSide, RightSide],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

}
