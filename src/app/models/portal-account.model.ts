export interface PortalAccount {
    id: string;
    userName: string;
    role: 'Admin' | 'User';
    isActive: boolean;
    createdAtUtc: string;
}

export interface PortalSession {
    token: string;
    expiresAtUtc: string;
    account: PortalAccount;
}