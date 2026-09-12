export class RegisterModel {

    login: string = '';
    password: string = '';
    email: string = '';
    genero?: string = '';

    constructor (
        login: string, password: string, email: string, genero?: string
    ) {
        this.login = login;
        this.password = password;
        this.email = email;
        this.genero = genero;
    }
}