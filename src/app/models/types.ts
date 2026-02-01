export interface Question {
    id: string;
    type: 'text' | 'radio';
    title: string;
    options?: string[];
}

export interface AnswerPayload {
    account: string;
    avatar: string;
    answers: { questionId: string; answer: string }[];
}

export interface ApiResponse {
    status: string;
    message: string;
}
