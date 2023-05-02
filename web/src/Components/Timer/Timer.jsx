import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/es';
moment().local('es');

function Timer() {
    const getTime = () => moment().format('DD [de] MMMM YYYY - h:mm a');
    const [time, setTime] = useState(getTime());

    useEffect(() => {
        setInterval(() => {
            setTime(getTime);
        }, 2000);
        return () => {
            setTime();
        }
    }, []);

    return (
        <div className="w-full">
            <div className="flex xs:justify-center md:justify-end text-[15px] xs:text-v2-text-bar-steps text-gray-500">
                { time }
            </div>
        </div>
    )
}

export default Timer