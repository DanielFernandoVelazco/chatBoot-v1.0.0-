export interface User {
    id: string;
    username: string;
    email: string;
    fullName: string;
    bio: string;
    profilePicture: string;
    status: string;
    lastSeen: Date;
    createdAt: Date;
    updatedAt: Date;
    privacySettings: PrivacySettings;
    notificationSettings: NotificationSettings;
    contacts: string[];
}

export interface PrivacySettings {
    lastSeenVisibility: string;
    profilePictureVisibility: string;
    infoVisibility: string;
    readReceipts: boolean;
}

export interface NotificationSettings {
    desktopNotifications: boolean;
    soundEnabled: boolean;
    notificationTone: string;
    messageNotificationType: string;
    doNotDisturb: boolean;
}