export default interface Edible {
    _id: string;
    name: string;
    description: string;
    price: number;
    type: string;
    imageURL?: string;
    menu: boolean;
    discount: number;
    available: boolean;
}