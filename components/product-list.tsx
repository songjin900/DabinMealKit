import useSWR from "swr"
import Item from "./items";
import ItemsWide from "./itemsWide";
import { Product } from "@prisma/client";

interface ProductWithCount extends Product{

    _count:{
        favs: number;
    }
}

interface ProductsResponse {

}

interface Record {
    id: number;
    product: ProductWithCount;
}

interface ProductListResponse {
    [key: string]: Record[]
}

interface ProductListProps {
    kind: "sales" | "purchases" | "cart"
}

export default function ProductList({ kind }: ProductListProps) {
    const { data } = useSWR<ProductListResponse>(`/api/users/me/${kind}`);
    return data ? <>{data[kind]?.map((record) => (
        <ItemsWide
            id={record.product.id}
            key={record.id}
            title={record.product.name}
            price={record.product.price}
            comments={record.product.description}
            kind = "large"
        />
    ))}</> : null
}