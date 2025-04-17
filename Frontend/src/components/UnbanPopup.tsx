'use client'
import { useSession } from 'next-auth/react';
import { unbanUser } from '@/libs/banUser';

export default function BanPopup({ uid, onClose }: { uid: string; onClose: () => void }) {
    const { data: session } = useSession();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await unbanUser(uid, session?.user?.token || '');
            window.location.reload();
            onClose();
        } catch (error) {
            console.error('Error Unban User:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
                <h2 className="text-xl font-semibold mb-4">Unban User Confirmation</h2>
                    <div className='w-full mb-4'>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Are You sure you want to unban this user?
                        </label>
                    </div>
                    <div className="flex justify-end space-x-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleSubmit}
                        >
                            Unban
                        </button>
                    </div>
            </div>
        </div>
    );
}