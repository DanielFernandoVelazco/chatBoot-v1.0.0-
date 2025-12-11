export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    fullName: string;
    password: string;
    bio?: string;
}

export interface AuthResponse {
    token: string;
    type: string;
    username: string;
    email: string;
    message: string;
}