'use client'
import { useState } from 'react';
import dayjs from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useSession } from 'next-auth/react';
import { banUser } from '@/libs/banUser';

interface BanPopupProps {
    uid: string;
    onClose: () => void;
}

export default function BanPopup({ uid,onClose }: BanPopupProps) {

    const [formData, setFormData] = useState({
        reason: '',
        unbanDate: dayjs(),
    });

    const { data: session } = useSession();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await banUser(uid, session?.user?.token || '', formData.reason, formData.unbanDate.format('YYYY-MM-DDT00:00:00.000+00:00'));
            window.location.reload();
            onClose();
        } catch (error) {
            console.error('Error Ban User:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
                <h2 className="text-xl font-semibold mb-4">Ban User Form</h2>
                <form onSubmit={handleSubmit}>
                    <div className='w-full mb-4'>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reason for Ban
                        </label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            required
                        />
                    </div>
                    <div className='w-full'>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unban Date
                        </label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker 
                            value={formData.unbanDate} 
                            onChange={(date) => setFormData({ ...formData, unbanDate:dayjs(date) })}
                            className="w-full"
                            slotProps={{ textField: { fullWidth: true } }}
                          />
                        </LocalizationProvider>
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
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}