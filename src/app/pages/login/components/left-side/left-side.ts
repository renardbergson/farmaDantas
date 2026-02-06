import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-left-side',
  imports: [FormsModule],
  templateUrl: './left-side.html',
  styleUrl: './left-side.css',
  host: {
    'class': 'form-side'
  }
})
export class LeftSide {
  constructor(private router: Router) { }

  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  isSubmitting = signal(false);

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.router.navigate(['/user/dashboard']);
  }
}
