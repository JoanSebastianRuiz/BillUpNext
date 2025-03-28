const TableMessage = ({ message, colSpan = 3 }: { message: string, colSpan?: number }) => {
    return (
        <tr>
            <td colSpan={colSpan} className="text-center py-4 text-gray-500 dark:text-gray-400">
                {message}
            </td>
        </tr>
    )
}

export default TableMessage;