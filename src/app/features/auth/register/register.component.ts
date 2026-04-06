import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LucideAngularModule, Mail, Lock, UserPlus, Chrome, User } from 'lucide-angular';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, LucideAngularModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly UserPlus = UserPlus;
  readonly Chrome = Chrome;
  readonly User = User;

  registerForm: FormGroup = this.fb.group({
    displayName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  isLoading = false;
  errorMessage = '';

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  async onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const { email, password } = this.registerForm.value;
      await this.authService.signUpWithEmail(email, password);
      // Optional: Update profile with displayName here if needed
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/upload';
      this.router.navigateByUrl(returnUrl);
    } catch (error: any) {
      this.errorMessage = error.message || 'Failed to create account. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  async loginWithGoogle() {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.authService.signInWithGoogle();
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/upload';
      this.router.navigateByUrl(returnUrl);
    } catch (error: any) {
      this.errorMessage = error.message || 'Google login failed.';
    } finally {
      this.isLoading = false;
    }
  }
}
