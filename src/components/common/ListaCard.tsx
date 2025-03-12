import { ReactNode } from "react"

const ListaCard = ({ name, children }: { name: string, children: ReactNode }) => {
    return (
        <div>
            <h2 className="text-lg font-bold tracking-wide">{name}</h2>
            <div className="mt-3">{children}</div>
        </div>
    )
}

export default ListaCard;