import React from 'react';
import { Text, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { ChevronDownIcon } from 'react-native-heroicons/outline';
import PropTypes from 'prop-types';
function Select({label, items, needed, labelDescription, title, ...rest}){

    return (
        <View>
            {label && (
                <Text className='font-bold'>
                    {label}
                    {labelDescription && <Text className='ml-1 text-xs text-gray-400'>{labelDescription}</Text>}
                    {needed && <Text className='text-red-400'> *</Text>}
                </Text>
            )}
            <View className={'w-full mb-5 items-center'}>
                <View className='w-64 my-2 text-gray-400 py-2 px-4 rounded-full bg-white border'>
                    <RNPickerSelect
                        placeholder={{ label: 'Selecciona un valor', value: 'Selecciona un valor' }}
                        items={items}
                        Icon={() => {
                            return (
                                <ChevronDownIcon color={"black"}/> 
                                );
                            }}
                        {...rest}
                    />
                </View>
                
            </View>
        </View>
    )

}

Select.propTypes = {
    label: PropTypes.string,
    needed: PropTypes.bool,
    labelDescription : PropTypes.string,
    placeholder: PropTypes.string,
}

Select.defaultProps = {
    needed: false
}

export default Select;
