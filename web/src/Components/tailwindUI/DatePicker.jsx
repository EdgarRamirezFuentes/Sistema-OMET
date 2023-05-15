import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DatePicker, { utils as datePickerUtils } from 'react-modern-calendar-datepicker';
import { Transition } from '@headlessui/react';
import { CalendarIcon } from '@heroicons/react/20/solid';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const customLocale = {
    // months list by order
    months: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
    ],

    // week days by order
    weekDays: [
        {
            name: 'Domingo',
            short: 'D',
            isWeekend: true,
        },
        {
            name: 'Lunes',
            short: 'L',
        },
        {
            name: 'Martes',
            short: 'M',
        },
        {
            name: 'Miércoles',
            short: 'M',
        },
        {
            name: 'Jueves',
            short: 'J',
        },
        {
            name: 'Viernes',
            short: 'V',
        },
        {
            name: 'Sábado',
            short: 'S',
            isWeekend: true,
        },
    ],

    // just play around with this number between 0 and 6
    weekStartingIndex: 0,

    // return a { year: number, month: number, day: number } object
    getToday(gregorainTodayObject) {
        return gregorainTodayObject;
    },

    // return a native JavaScript date here
    toNativeDate(date) {
        return new Date(date.year, date.month - 1, date.day);
    },

    // return a number for date's month length
    getMonthLength(date) {
        return new Date(date.year, date.month, 0).getDate();
    },

    // return a transformed digit to your locale
    transformDigit(digit) {
        return digit;
    }
}

function CustomDatePicker({ label, needed, placeholder, error, disabled, minimumDate, maximumDate, value, onChange }) {

    const [selectedDay, setSelectedDay] = useState(value);

    useEffect(() => {
        onChange(selectedDay);
    }, [selectedDay]);

    useEffect(() => {
        setSelectedDay(value);
    }, [value]);

    const renderInput = ({ ref }) => (
        <div>
            <div className="relative rounded-md shadow-sm">
                <input
                    readOnly
                    ref={ref}
                    value={selectedDay ? `${selectedDay.year}/${selectedDay.month}/${selectedDay.day}` : ''}
                    className={classNames(
                        error ? 'border-red-300 text-red-900 placeholder-red-300 focus-visible:ring-1 focus-visible:ring-red-500 focus-visible:border-red-500' 
                            : 'border-gray-300 text-gray-800 placeholder:text-gray-300 focus-visible:ring-1 focus-visible:ring-v2-blue-text-login focus-visible:border-v2-blue-text-login',
                        disabled ? 'opacity-80 bg-gray-200 cursor-not-allowed' : '',
                        'border transition-all block w-full sm:text-sm rounded-md px-4 py-2 outline-none'
                    )}
                    placeholder={placeholder}
                    disabled={disabled}
                />
                <div onClick={() => ref?.current?.focus()} className="absolute inset-y-0 max-w-[1.25rem] right-0 mr-3 flex items-center overflow-hidden">
                    <CalendarIcon className={`${error ? 'text-red-500' : 'text-v2-blue-text-login'} w-5 h-5`} />
                </div>
            </div>
        </div>
    )

    return (
        <div className='w-full'>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {needed && <span className='text-red-400'> *</span>}
                </label>
            )}
            <div className="mt-1 w-full">
                <DatePicker
                    value={selectedDay}
                    onChange={setSelectedDay}
                    locale={customLocale}
                    wrapperClassName='w-full z-10 responsive-calendar'
                    renderInput={renderInput}
                    calendarClassName='block font-normal text-v2-input-text'
                    calendarPopperPosition='top'
                    colorPrimary='#2169AC'
                    minimumDate={minimumDate}
                    maximumDate={maximumDate}
                />
            </div>
            <Transition
                show={error != null}
                enter="transition-all ease-in"
                enterFrom="max-h-0 opacity-0"
                enterTo="max-h-[3rem] opacity-100"
                leave="transition-all ease-out"
                leaveFrom="max-h-[3rem] opacity-100"
                leaveTo="max-h-0 opacity-0">
                <span className='text-sm text-red-600'>{error}</span>
            </Transition>
        </div>
    )
}

CustomDatePicker.propTypes = {
    label: PropTypes.string,
    needed: PropTypes.bool,
    placeholder: PropTypes.string,
    error: PropTypes.string,
    disabled: PropTypes.bool,
    minimumDate: PropTypes.any,
    maximumDate: PropTypes.any,
    value: PropTypes.any,
    onChange: PropTypes.func
}

CustomDatePicker.defaultProps = {
    needed: false,
    disabled: false
}

export const utils = () => {

    const toNativeDate = date => {
        return new Date(date.year, date.month - 1, date.day);
    }

    const toDate = nativeDate => {
        return {
            year: nativeDate.getFullYear(),
            month: nativeDate.getMonth() + 1,
            day: nativeDate.getDate()
        }
    }

    const addDays = (days, date = new Date()) => {
        date.setDate(date.getDate() + days);
        return toDate(date);
    };
    
    const addMonths = (months, date = new Date()) => {
        date.setMonth(date.getMonth() + months);
        return toDate(date);
    }
    
    const getFirstDayOfNextMonth = () => {
        const date = new Date();
        let nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        return toDate(nextMonth);
    }

    const getLastDayOfMonth = (date = new Date()) => {
        const nexMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return toDate(nexMonth);
    }

    return {
        ...datePickerUtils(),
        toNativeDate,
        toDate,
        addDays,
        addMonths,
        getFirstDayOfNextMonth,
        getLastDayOfMonth
    }
}

export default CustomDatePicker;