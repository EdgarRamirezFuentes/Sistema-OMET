import React, {useEffect, useState} from 'react';
import { View, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import PropTypes from 'prop-types';
const TimePicker = ({mode, value, minimumDate, label, labelDescription, needed, onValueChange, disabledInput,...rest}) => {

    const [date, setDate] = useState('');

    useEffect(() => {
        if(mode === 'date'){
            if (date?.nativeEvent?.timestamp){
                let d = new Date(date.nativeEvent?.timestamp).toISOString().split('T')[0]
                onValueChange && onValueChange(d)
            }
        }
        else if (mode === 'time'){
            if (date?.nativeEvent?.timestamp){
                let d = new Date(date.nativeEvent?.timestamp).toISOString().split('T')[1].split(':')
                let h = parseInt(d[0]-6)
                if (h < 0){
                    h = 24+h
                }
                d = h+":"+d[1]
                onValueChange && onValueChange(d)
            }
            //onValueChange && onValueChange(date)
        }
    },[date])


    return (
        <View>
            {label && (
                <Text className='font-bold'>
                    {label}
                    {labelDescription && <Text className='ml-1 text-xs text-gray-400'>{labelDescription}</Text>}
                    {needed && <Text className='text-red-400'> *</Text>}
                </Text>
            )}
            <View  pointerEvents={disabledInput ? 'none':'auto'} className={`${disabledInput ? 'w-full mb-5 items-center bg-slate-100 text-gray-500' : 'w-full mb-5 items-center' }`}>
                <DateTimePicker locale="es-ES" themeVariant="light" timeZoneName={"America/Mexico_City"} style={{width:"100%"}} mode={mode} value={value} minimumDate={minimumDate} onChange={setDate} {...rest}/>
            </View>
        </View>
    )
}

TimePicker.propTypes = {
    mode : PropTypes.string,
    value : PropTypes.instanceOf(Date),
    minimumDate : PropTypes.instanceOf(Date),
    onValueChange : PropTypes.func,
    disabledInput : PropTypes.bool,
};

TimePicker.defaultProps = {
    mode : "date",
    value : new Date(),
}

export default TimePicker;