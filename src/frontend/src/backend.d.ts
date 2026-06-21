import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserId = bigint;
export type DirectResetPasswordResult = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export interface Activity {
    id: bigint;
    websiteUrl: string;
    name: string;
    tags: Array<string>;
    description: string;
    imageUrl: string;
    eventDateEnd?: string;
    category: string;
    rating: number;
    location: string;
    eventDate?: string;
}
export interface UserPublic {
    id: UserId;
    createdAt: bigint;
    email: string;
    lastName: string;
    firstName: string;
}
export type FavoriteResult = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export type GetMeResult = {
    __kind__: "ok";
    ok: UserPublic;
} | {
    __kind__: "err";
    err: string;
};
export type AuthResult = {
    __kind__: "ok";
    ok: UserPublic;
} | {
    __kind__: "err";
    err: string;
};
export type UpdateUserResult = {
    __kind__: "ok";
    ok: UserPublic;
} | {
    __kind__: "err";
    err: string;
};
export interface backendInterface {
    addFavorite(activityId: bigint): Promise<FavoriteResult>;
    forgotPassword(email: string, newPassword: string, confirmPassword: string): Promise<DirectResetPasswordResult>;
    getActivities(): Promise<Array<Activity>>;
    getActivitiesByCityAndState(city: string, state: string): Promise<Array<Activity>>;
    getActivitiesByCityStateAndCategory(city: string, state: string, category: string): Promise<Array<Activity>>;
    getActivity(id: bigint): Promise<Activity | null>;
    getByCategory(category: string): Promise<Array<Activity>>;
    getFavorites(): Promise<Array<bigint>>;
    getMe(): Promise<GetMeResult>;
    getWeekendEventsByCityAndState(city: string, state: string, currentDate: string | null): Promise<Array<Activity>>;
    login(email: string, password: string): Promise<AuthResult>;
    logout(): Promise<void>;
    register(firstName: string, lastName: string, email: string, password: string): Promise<AuthResult>;
    removeFavorite(activityId: bigint): Promise<FavoriteResult>;
    searchActivities(searchQuery: string): Promise<Array<Activity>>;
    updateUser(firstName: string, lastName: string, email: string): Promise<UpdateUserResult>;
}
