
interface Edible {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageURL?: string;
    type: string;
    menu: boolean;
    discount: number;
}
export default Edible;