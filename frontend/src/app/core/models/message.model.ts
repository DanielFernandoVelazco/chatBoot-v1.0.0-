export interface Message {
    id: string;
    chatId: string;
    senderId: string;
    senderName: string;
    type: MessageType;
    content: string;
    replyTo?: ReplyInfo;
    editInfo?: EditInfo;
    fileMetadata?: FileMetadata;
    deliveryStatus: DeliveryStatus;
    reactions: Reaction[];
    timestamp: Date;
    deliveredAt?: Date;
    readAt?: Date;
    metadata?: { [key: string]: any };
}

export interface ReplyInfo {
    messageId: string;
    senderName: string;
    previewContent: string;
}

export interface EditInfo {
    previousContent: string;
    editedAt: Date;
    editCount: number;
}

export interface FileMetadata {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    thumbnailUrl?: string;
    duration?: number;
    width?: number;
    height?: number;
}

export interface DeliveryStatus {
    delivered: boolean;
    read: boolean;
    readBy: string[];
    deliveredTo: string[];
}

export interface Reaction {
    userId: string;
    emoji: string;
    timestamp: Date;
}

export enum MessageType {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    FILE = 'FILE',
    VIDEO = 'VIDEO',
    AUDIO = 'AUDIO',
    LOCATION = 'LOCATION',
    CONTACT = 'CONTACT',
    SYSTEM = 'SYSTEM'
}