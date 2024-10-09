import { useContext } from "react"
import { AppContext } from "../layout/Layout"

export default function UserDetailsPage() {
    const appContext = useContext(AppContext)
    return <div className="user-details-page">
        <h1>User Details Page</h1>
        <div className="details">
            <p><b>name: </b> {appContext.appState?.user?.name} </p>
            <p><b>email: </b> {appContext.appState?.user?.email} </p>
        </div>
    </div>
}
