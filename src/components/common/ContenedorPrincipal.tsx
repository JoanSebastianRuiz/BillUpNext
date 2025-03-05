import { ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

import NavBarAdmin from '../navs/NavBarAdmin';
import ThemeSwitcher from './ThemeSwitcher';
import NavBarSupervisor from '../navs/NavBarSupervisor';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface ContenedorPrincipalProps {
    children: ReactNode;
}

const ContenedorPrincipal = ({ children }: ContenedorPrincipalProps) => {
    const { data: session, status } = useSession();
    const idRol = session?.user?.idRol;

    if (status === "loading") {
        return <LoadingSpinner />;
    }

    return (
        <div className='className="relative flex flex-col min-h-screen max-h-screen overflow-auto bg-gray-50 dark:bg-gray-800 p-5'>
            <div className="flex justify-between mb-2 mx-2">
                {idRol === 1 && <NavBarAdmin />}
                {idRol === 2 && <NavBarSupervisor />}
                <ThemeSwitcher />
            </div>
            <div className="flex-1 overflow-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {children}
                </motion.div>
            </div >
        </div>

    );
}

export default ContenedorPrincipal;