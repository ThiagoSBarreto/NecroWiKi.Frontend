import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { REGISTER_CONFIG, RegisterConfig } from '../../config/register.config';
import { SelectModule } from 'primeng/select';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,

        CardModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        MessageModule,
        SelectModule
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit {

    @Input() type = 'wow';

    config!: RegisterConfig;

    submitted = false;

    registerForm: FormGroup;

    constructor(
        private readonly fb: FormBuilder,
        private readonly route: ActivatedRoute,
        private readonly router: Router
    ) {
        this.registerForm = this.fb.group({
            username: ['', [Validators.required, Validators.maxLength(16)]],
            password: ['', [Validators.required, Validators.maxLength(16)]],
            passwordConfirm: ['', [Validators.required, Validators.maxLength(16)]],
            email: [
                '',
                [
                    Validators.required,
                    Validators.email,
                    Validators.maxLength(255),
                ],
            ],
            gender: [''],
        });
    }

    ngOnInit(): void {
        this.type = this.route.snapshot.paramMap.get('type') ?? 'wow';

        this.config = REGISTER_CONFIG[this.type];

        if (!this.config) {
            throw new Error(
                `Configuração de cadastro não encontrada: ${this.type}`
            );
        }

        if (this.config.fields.gender) {
            this.gender.setValidators([Validators.required]);
            this.gender.updateValueAndValidity();
        }
    }

    get username() {
        return this.registerForm.controls['username'];
    }

    get password() {
        return this.registerForm.controls['password'];
    }

    get passwordConfirm() {
        return this.registerForm.controls['passwordConfirm'];
    }

    get email() {
        return this.registerForm.controls['email'];
    }

    get gender() {
        return this.registerForm.controls['gender'];
    }

    passwordsDoNotMatch(): boolean {
        return (
            this.password.value !== this.passwordConfirm.value &&
            this.passwordConfirm.value !== ''
        );
    }

    isInvalid(control: any): boolean {
        return control.invalid && (control.touched || this.submitted);
    }

    submit(): void {
        this.submitted = true;

        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        if (this.passwordsDoNotMatch()) {
            this.passwordConfirm.markAsTouched();
            return;
        }

        console.log('Register:', {
            type: this.type,
            ...this.registerForm.value,
        });
    }

    goHome(): void {
        this.router.navigate(['/']);
    }
}