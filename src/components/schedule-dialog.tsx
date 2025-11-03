import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { DateTime } from "luxon";
import { useAuth } from "@/context/AuthContext";
import { Input } from "./ui/input";
import { toast } from "react-hot-toast";

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSchedule: (scheduledTime: DateTime) => void;
}

export function ScheduleDialog({
  open,
  onOpenChange,
  onSchedule,
}: ScheduleDialogProps) {
  const { user } = useAuth();
  const timezone = user?.timezone || DateTime.local().zoneName;
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState(() => {
    // Default to next hour rounded up
    const now = DateTime.now().setZone(timezone);
    const nextHour = now.plus({ hours: 1 }).startOf("hour");
    return nextHour.toFormat("HH:mm");
  });

  // Reset state when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      // Reset to tomorrow's date and next rounded hour
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow);

      const now = DateTime.now().setZone(timezone);
      const nextHour = now.plus({ hours: 1 }).startOf("hour");
      setTime(nextHour.toFormat("HH:mm"));
    }
    onOpenChange(newOpen);
  };

  const handleSchedule = () => {
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    if (!time) {
      toast.error("Please select a time");
      return;
    }

    // Parse the selected time
    const [hours, minutes] = time.split(":").map(Number);

    // Create DateTime object with selected date and time in user's timezone
    const scheduledTime = DateTime.fromJSDate(date)
      .setZone(timezone)
      .set({ hour: hours, minute: minutes, second: 0, millisecond: 0 });

    // Validate that scheduled time is in the future
    const now = DateTime.now().setZone(timezone);
    if (scheduledTime <= now) {
      toast.error("Please select a future date and time");
      return;
    }

    onSchedule(scheduledTime);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white sm:max-w-[425px]">
        <DialogTitle className="text-xl font-bold">Schedule Post</DialogTitle>

        <div className="grid gap-4 py-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(dateToCheck) => {
                // Disable dates before today
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return dateToCheck < today;
              }}
              className="bg-slate-800 text-white border-slate-700 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Time ({timezone})
            </label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
            />
            <p className="text-xs text-slate-400 mt-1">
              Current time: {DateTime.now().setZone(timezone).toFormat("HH:mm")}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSchedule}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
