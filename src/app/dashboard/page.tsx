"use client"

import ContenedorPrincipal from "@/components/common/ContenedorPrincipal";
import { useSession } from "next-auth/react";

const DashboardPage = () => {

    const { data: session, status } = useSession();

    return (
        <>
            <ContenedorPrincipal>
                <h1>Dashboard</h1>
                {session ? (
                    <div>
                        <p>Welcome, {JSON.stringify(session.user)}</p>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </ContenedorPrincipal>
        </>
    )
}

export default DashboardPage;