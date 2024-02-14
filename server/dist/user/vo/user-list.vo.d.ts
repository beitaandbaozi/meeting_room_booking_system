declare class User {
    id: number;
    username: string;
    nickName: string;
    email: string;
    phoneNumber: string;
    isFrozen: boolean;
    headPic: string;
    createTime: Date;
}
export declare class UserListVo {
    users: User[];
    totalCount: number;
}
export {};
