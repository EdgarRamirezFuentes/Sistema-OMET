import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
//import { Transition } from 'react-transition-group'; // Assuming you find a suitable transition library for React Native

function Input({
    label, 
    labelDescription, 
    needed, 
    leftIcon, 
    type, 
    name, 
    id, 
    placeholder, 
    rightIcon, 
    rightIconAction, 
    error, 
    disabledInput, 
    register, 
    ...rest 
}) {
    return (
        <View>
            {label && (
                <Text className='font-bold'>
                    {label}
                    {labelDescription && <Text className='ml-1 text-xs text-gray-400'>{labelDescription}</Text>}
                    {needed && <Text className='text-red-400'> *</Text>}
                </Text>
            )}
            <View className='mb-10 w-full flex flex-row justify-center'>
                {leftIcon && (
                    <View className="absolute inset-y-0 max-w-[1.25rem] left-0 ml-3 flex items-center pointer-events-none overflow-hidden">
                        {leftIcon}
                    </View>
                )}
                <TextInput
                    className={`${disabledInput ? 'w-64 my-2 py-2 px-4 rounded-lg bg-slate-100 text-gray-500 border' : 'w-64 my-2 py-2 px-4 rounded-lg bg-white border'}`}
                    placeholder={placeholder}
                    editable={!disabledInput}
                    {...register}
                    {...rest}
                />
            </View>
        </View>
    )
}

Input.propTypes = {
    label: PropTypes.string,
    labelDescription: PropTypes.string,
    needed: PropTypes.bool,
    leftIcon: PropTypes.element,
    type: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    placeholder: PropTypes.string,
    rightIcon: PropTypes.element,
    rightIconAction: PropTypes.func,
    error: PropTypes.string,
    disabledInput: PropTypes.bool,
    register: PropTypes.any
}

Input.defaultProps = {
    needed: false,
    type: 'text',
    disabledInput: false
}

export default Input;
