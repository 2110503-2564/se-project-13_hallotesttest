"use client"
import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Select, MenuItem, FormControl } from '@mui/material';
import DateReserve from './DateReserve';
import dayjs, { Dayjs } from 'dayjs';
import getcoworkings from '@/libs/getCoworkings';
import editBooking from '@/libs/editBooking';

interface EditReservationModalProps {
  open: boolean;
  onClose: () => void;
  reservation: any;
  token: string;
  onReservationUpdated: () => void;
}

export default function EditBooking({
  open,
  onClose,
  reservation,
  token,
  onReservationUpdated
}: EditReservationModalProps) {
  const [coworkingId, setCoworkingId] = useState<string>(reservation?.coWorking?._id || '');
  const [date, setDate] = useState<Dayjs | null>(reservation ? dayjs(reservation.reservDate) : null);
  const [coworkingSpaces, setCoworkingSpaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchCoworkingSpaces();
    }
  }, [open]);

  useEffect(() => {
    if (reservation) {
      setCoworkingId(reservation.coWorking._id);
      setDate(dayjs(reservation.reservDate));
    }
  }, [reservation]);

  const fetchCoworkingSpaces = async () => {
    try {
      setLoading(true);
      const coworkingsData = await getcoworkings();
      if (coworkingsData && coworkingsData.data) {
        setCoworkingSpaces(coworkingsData.data);
      }
    } catch (error) {
      console.error("Error fetching coworking spaces:", error);
      setError("Failed to load coworking spaces");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!reservation || !date || !coworkingId) {
      return;
    }

    try {
      setLoading(true);
      await editBooking(
        reservation._id, 
        date.format("YYYY-MM-DD"), 
        coworkingId, 
        token
      );
      onReservationUpdated();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update reservation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="text-2xl font-bold text-indigo-900 p-6">
        Edit Reservation
      </DialogTitle>
      <DialogContent className="p-6">
        {error && (
          <div className="mt-4 mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="mt-4 space-y-6">
          <div>
            <div className="text-lg font-semibold text-indigo-900 mb-2">
              Co-Working Space
            </div>
            <FormControl fullWidth variant="outlined">
              <Select
                name="coworking"
                value={coworkingId}
                onChange={(e) => setCoworkingId(e.target.value as string)}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg"
                disabled={loading}
              >
                {coworkingSpaces.map((space) => (
                  <MenuItem key={space.id} value={space._id || space.id}>
                    {space.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          
          <div>
            <div className="text-lg font-semibold text-indigo-900 mb-2">
              Booking Date
            </div>
            <DateReserve 
              onDateChange={(value: Dayjs) => setDate(value)} 
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions className="p-6">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-indigo-300 text-indigo-600 hover:bg-indigo-50 font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading || !date || !coworkingId}
          className={`px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium ml-2 ${loading || !date || !coworkingId ? 'opacity-70 cursor-not-allowed' : 'hover:from-indigo-600 hover:to-purple-600'}`}
        >
          {loading ? 'Updating...' : 'Save Changes'}
        </button>
      </DialogActions>
    </Dialog>
  );
}