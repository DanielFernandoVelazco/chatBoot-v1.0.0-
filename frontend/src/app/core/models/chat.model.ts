export interface Chat {
    id: string;
    name?: string;
    description?: string;
    type: ChatType;
    participantIds: string[];
    lastMessage?: LastMessageInfo;
    settings: ChatSettings;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}

export interface LastMessageInfo {
    messageId: string;
    content: string;
    senderId: string;
    senderName: string;
    timestamp: Date;
    messageType: MessageType;
}

export interface ChatSettings {
    notificationsEnabled: boolean;
    customNotificationTone: string;
    isArchived: boolean;
    isPinned: boolean;
    theme?: string;
}

export enum ChatType {
    PRIVATE = 'PRIVATE',
    GROUP = 'GROUP'
}

export enum MessageType {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    FILE = 'FILE',
    VIDEO = 'VIDEO',
    AUDIO = 'AUDIO'
}