export type event = {
    name: string,
    date: number,
    joinUntil: number,
    price: number,
    currency: string,
    code: string
};

export type participant = {
    name: string,
    email: string,
    code: string,
    joinedAt: number,
    wish: string
}