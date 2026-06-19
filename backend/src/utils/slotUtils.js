const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function toMinutes(value) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function toTime(minutes) {
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const m = String(minutes % 60).padStart(2, "0");
  return `${h}:${m}`;
}

export function isDoctorAvailableOnDate(doctor, dateString) {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  const day = dayNames[date.getUTCDay()];
  const leaveDays = doctor.leaveDays?.map((item) => item.toISOString().slice(0, 10)) || [];
  return doctor.isActive && doctor.workingDays.includes(day) && !leaveDays.includes(dateString);
}

export function generateDoctorSlots(doctor, dateString, bookedSlots = []) {
  if (!isDoctorAvailableOnDate(doctor, dateString)) return [];

  const start = toMinutes(doctor.workingHours.start);
  const end = toMinutes(doctor.workingHours.end);
  const duration = doctor.slotDuration || 20;
  const breaks = doctor.breakTimes || [];
  const booked = new Set(bookedSlots);
  const slots = [];

  for (let current = start; current + duration <= end; current += duration) {
    const time = toTime(current);
    const inBreak = breaks.some((breakTime) => {
      return current >= toMinutes(breakTime.start) && current < toMinutes(breakTime.end);
    });

    slots.push({
      time,
      available: !inBreak && !booked.has(time)
    });
  }

  return slots;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
