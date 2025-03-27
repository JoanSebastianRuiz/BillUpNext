import { ReactNode } from "react";

const TableRow = ({ children }: {children: ReactNode}) => {
    return (
        <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
            {children}
        </tr>
    );
};

export default TableRow;