export interface User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

//request payloads

export interface LoginPayload {
    username: string;
    password: string;
}

export interface RegisterPayload {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ResetPasswordPayload {
    token: string;
    password: string;
}

//API responses

export interface AuthResponse {
    user: User;
    token: string;
}

export interface ApiError {
    message: string;
    field?: string;
}

//form states
export interface LoginForm {
    username: string;
    password: string;
}

export interface RegisterForm {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ForgotPasswordForm {
    email: string;
}

export interface ResetPasswordForm {
    password: string;
    confirmPassword: string;
}