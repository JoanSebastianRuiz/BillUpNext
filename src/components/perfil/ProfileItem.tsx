import { FC } from 'react';

interface ProfileItemProps {
    icon: FC<{ className?: string }>;
    label: string;
    value: string;
}

const ProfileItem: FC<ProfileItemProps> = ({ icon: Icon, label, value }) => {
    return (
        <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg transition-all">
            <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                <p className="text-base font-medium text-gray-800 dark:text-white">{value}</p>
            </div>
        </div>
    );
};

export default ProfileItem;