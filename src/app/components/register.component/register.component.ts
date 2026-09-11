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
import { BackendService } from '../../services/backend.service';
import { RegisterModel } from '../../models/register.model';

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
    providers: [
        BackendService
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit {

    type: string = 'wow';

    config!: RegisterConfig;

    submitted = false;

    registerForm: FormGroup;

    constructor(
        private readonly fb: FormBuilder,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private backendService: BackendService
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
        this.route.paramMap.subscribe(params => {
            const type: string | null = params.get('type');

            if (type !== 'wow' && type !== 'ragnarok') {
                throw new Error(`Tipo de cadastro inválido: ${type}`);
            }

            this.type = type;
            this.config = REGISTER_CONFIG[this.type];

            if (this.config.fields.gender) {
                this.gender.setValidators([Validators.required]);
            } else {
                this.gender.clearValidators();
            }

            this.gender.updateValueAndValidity();
        });
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

        const formValue = this.registerForm.value;

        const model: RegisterModel = new RegisterModel(
            formValue.username ?? '',
            formValue.password ?? '',
            formValue.email ?? '',
            formValue.gender ?? ''
        );

        this.backendService.registerClient(this.type, model).subscribe({
            next: (response) => {
                console.log(response);
                this.registerForm.reset();
            },
            error: (err) => {
                console.log(err);
            }
        })
    }

    goHome(): void {
        this.router.navigate(['/']);
    }
}