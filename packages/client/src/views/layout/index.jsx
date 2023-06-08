import { Outlet } from "react-router-dom";
import Auth from "../../provider/auth";
import Guard from "../../components/Guard";

export default function Layout() {
    return(
        <>
        <Auth>
            <Guard>
                <Outlet/>
            </Guard>
        </Auth>
        </>
    )
}