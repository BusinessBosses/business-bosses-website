import React, { useState } from "react";

import exclamation from "/icons/triangle-exclamation.svg";
import Spinner from "./spinner";

interface DatePickerProps {
  onChange: (date: string | { start: string; end: string }) => void;
  onReset: () => void;
  onFilter: () => void;
  isFetching?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  onChange,
  onReset,
  onFilter,
  isFetching = false,
}) => {
  const [isRangeMode, setIsRangeMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [nodateselected, setNodateselected] = useState(false);

  const formatDate = (date: Date): string => {
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: Date[] = [];

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const isSelected = (date: Date): boolean => {
    if (isRangeMode) {
      if (!dateRange.start || !dateRange.end) return false;
      return date >= dateRange.start && date <= dateRange.end;
    }
    return selectedDate?.getTime() === date.getTime();
  };

  const isRangeStart = (date: Date): boolean => {
    return dateRange.start?.getTime() === date.getTime();
  };

  const isRangeEnd = (date: Date): boolean => {
    return dateRange.end?.getTime() === date.getTime();
  };

  const handleDateClick = (date: Date) => {
    if (isPastDate(date)) return;

    if (isRangeMode) {
      if (!dateRange.start || dateRange.end) {
        setDateRange({ start: date, end: null });
      } else {
        if (date < dateRange.start) {
          setDateRange({ start: date, end: dateRange.start });
        } else {
          setDateRange({ ...dateRange, end: date });
        }
        onChange({
          start: formatDate(date < dateRange.start ? date : dateRange.start),
          end: formatDate(date < dateRange.start ? dateRange.start : date),
        });
      }
    } else {
      setSelectedDate(date);
      onChange(formatDate(date));
    }
  };

  const handleReset = () => {
    setSelectedDate(null);
    setDateRange({ start: null, end: null });
    onReset();
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(event.target.value);
    setCurrentMonth(new Date(currentMonth.getFullYear(), newMonth));
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(event.target.value);
    setCurrentMonth(new Date(newYear, currentMonth.getMonth()));
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="bg-transparent rounded-lg p-4 min-w-full">
      {nodateselected && (
        <div className="w-full text-sm bg-red-200 text-red-600 mb-5 h-10 rounded-md flex justify-center items-center font-medium">
          <img src={exclamation} alt="error icon" className="mr-1" />
          Please select a date or date range
        </div>
      )}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="mode"
              value="single"
              checked={!isRangeMode}
              onChange={() => {
                setIsRangeMode(false);
                handleReset();
              }}
              className="form-radio text-[#136DEB]"
            />
            <span className="text-sm text-gray-600">Single Mode</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="mode"
              value="range"
              checked={isRangeMode}
              onChange={() => {
                setIsRangeMode(true);
                handleReset();
              }}
              className="form-radio text-[#136DEB]"
            />
            <span className="text-sm text-gray-600">Range Mode</span>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
            )
          }
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="flex space-x-2">
          <select
            value={currentMonth.getMonth()}
            onChange={handleMonthChange}
            className="py-1 border rounded-md text-sm"
          >
            {months.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>
          <select
            value={currentMonth.getFullYear()}
            onChange={handleYearChange}
            className="py-1 border rounded-md text-sm"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
            )
          }
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500"
          >
            <div> {day}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0">
        {Array.from({
          length: new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            1
          ).getDay(),
        }).map((_, i) => (
          <div key={`empty-${i}`} className="p-2" />
        ))}
        {days.map((date, i) => {
          const isRangeDate =
            isRangeMode &&
            dateRange.start &&
            dateRange.end &&
            date >= dateRange.start &&
            date <= dateRange.end;
          const isRangeStartDate = isRangeStart(date);
          const isRangeEndDate = isRangeEnd(date);
          return (
            <button
              key={i}
              onClick={() => handleDateClick(date)}
              disabled={isPastDate(date)}
              className={`
                p-2 text-center transition-colors relative
                ${
                  isPastDate(date)
                    ? "text-gray-300 cursor-not-allowed"
                    : "hover:bg-blue-50 rounded-full"
                }
                
                ${isRangeDate ? " text-[#136DEB]" : ""}
                ${
                  isRangeStartDate ? "bg-[#136DEB] text-white rounded-r-xl" : ""
                }
                ${isRangeEndDate ? "bg-[#136DEB] text-white rounded-l-xl" : ""}
                ${
                  !isRangeMode && isSelected(date)
                    ? "bg-[#136DEB] text-white rounded-full"
                    : ""
                }
                ${
                  isRangeDate && !isRangeStartDate && !isRangeEndDate
                    ? "hover:bg-blue-200 rounded-full"
                    : ""
                }
              `}
            >
              <div className="rounded-full h-full w-full">{date.getDate()}</div>

              {isRangeDate && !isRangeStartDate && !isRangeEndDate && (
                <div className="absolute inset-0 bg-blue-100 -z-10" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex">
        <div className="flex justify-end pt-5 w-full">
          <div className="flex flex-row gap-2">
            <button
              className="text-sm  border font-bold text-[#44546F] rounded-md py-2 px-8 bg-[#E2E8F0]"
              onClick={handleReset}
            >
              Reset
            </button>
            <button
              className="text-sm  border font-bold border-gray-300 text-white rounded-md py-2 px-8 bg-gradient-to-b from-[#247EFC] to-[#0C66E4]"
              onClick={() => {
                if (!selectedDate && (!dateRange.start || !dateRange.end)) {
                  setNodateselected(true);
                } else {
                  setNodateselected(false);
                }
                onFilter();
              }}
            >
              {isFetching ? (
                <span className="stroke-white">
                  <Spinner />
                </span>
              ) : (
                "Filter"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
