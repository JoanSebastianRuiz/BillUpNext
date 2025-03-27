const TableMessage = ({ message }: { message: string }) => {
    return (
        <tr>
            <td colSpan={3} className="text-center py-4 text-gray-500 dark:text-gray-400">
                {message}
            </td>
        </tr>
    )
}

export default TableMessage;