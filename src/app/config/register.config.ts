export interface RegisterFieldConfig {
    label: string;
    placeholder: string;
    maxLength: number;
}

export interface RegisterThemeConfig {
    accent: string;
    accentHover: string;
    text: string;
    mutedText: string;
    cardBackground: string;
    inputBackground: string;
    border: string;
}

export interface RegisterGenderConfig {
    label: string;
    placeholder: string;
    options: {
        label: string;
        value: string;
    }[];
}

export interface RegisterConfig {
    title: string;
    subtitle: string;
    backgroundImage: string;

    theme: RegisterThemeConfig;

    fields: {
        username: RegisterFieldConfig;
        password: RegisterFieldConfig;
        passwordConfirm: RegisterFieldConfig;
        email: RegisterFieldConfig;
        gender?: RegisterGenderConfig;
    };

    button: string;
}

export const REGISTER_CONFIG: Record<string, RegisterConfig> = {
    wow: {
        title: 'Criar conta',
        subtitle: 'World of Warcraft · Wrath of the Lich King 3.3.5',

        backgroundImage: '/images/wow_bg.png',

        theme: {
            accent: '#f59e0b',
            accentHover: '#f59e0c',

            text: '#ffffff',
            mutedText: '#a0a0a0',

            cardBackground: 'rgba(15, 15, 15, 0.92)',
            inputBackground: 'rgba(0, 0, 0, 0.55)',

            border: 'rgba(255, 255, 255, 0.12)',
        },

        fields: {
            username: {
                label: 'Usuário',
                placeholder: 'Digite seu usuário',
                maxLength: 16,
            },

            password: {
                label: 'Senha',
                placeholder: 'Digite sua senha',
                maxLength: 16,
            },

            passwordConfirm: {
                label: 'Confirmar senha',
                placeholder: 'Digite sua senha novamente',
                maxLength: 16,
            },

            email: {
                label: 'E-mail',
                placeholder: 'Digite seu e-mail',
                maxLength: 255,
            },
        },

        button: 'Criar conta',
    },

    ragnarok: {
        title: 'Criar conta',
        subtitle: 'NecRO - Ragnarok Online',

        backgroundImage: '/images/rag_bg.png',

        theme: {
            accent: '#38bdf8',
            accentHover: '#38bdf8',

            text: '#ffffff',
            mutedText: '#a0a0a0',

            cardBackground: 'rgba(15, 15, 15, 0.92)',
            inputBackground: 'rgba(0, 0, 0, 0.55)',

            border: 'rgba(255, 255, 255, 0.12)',
        },

        fields: {
            username: {
                label: 'Usuário',
                placeholder: 'Digite seu usuário',
                maxLength: 16,
            },

            password: {
                label: 'Senha',
                placeholder: 'Digite sua senha',
                maxLength: 16,
            },

            passwordConfirm: {
                label: 'Confirmar senha',
                placeholder: 'Digite sua senha novamente',
                maxLength: 16,
            },

            email: {
                label: 'E-mail',
                placeholder: 'Digite seu e-mail',
                maxLength: 255,
            },

            gender: {
                label: 'Gênero',
                placeholder: 'Selecione seu gênero',
                options: [
                    {
                        label: 'Masculino',
                        value: 'M',
                    },
                    {
                        label: 'Feminino',
                        value: 'F',
                    },
                ],
            },
        },

        button: 'Criar conta',
    },
};