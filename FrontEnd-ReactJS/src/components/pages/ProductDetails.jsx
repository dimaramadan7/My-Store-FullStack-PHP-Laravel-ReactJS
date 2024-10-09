import { useContext } from "react"
import { AppContext } from "../layout/Layout"

export default function ProductDetails() {
    const appContext = useContext(AppContext)
    return <div className="user-details-page">
        <h1>Product Details Page</h1>
        <div className="details">
            gfyjh
        </div>
    </div>
}
