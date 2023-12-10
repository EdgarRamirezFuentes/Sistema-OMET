import React from 'react';
import { View, Text } from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import PropTypes from 'prop-types';

function CheckboxGroup({ type, show, title, needed, items, disabledInput, ...rest }) {

    return (
        <View>
            {title && (
                <Text className='font-bold'>
                    {title}
                    {needed && <Text className='text-red-400'> *</Text>}
                </Text>
            )}
            <View pointerEvents={disabledInput ? 'none':'auto'} className={`${disabledInput ? 'w-full my-2 rounded-md bg-slate-100 text-gray-500 border' : 'w-full my-2 rounded-md bg-white border'}`}>
            
                <SectionedMultiSelect
                    items={items}
                    IconRenderer={MaterialIcons}
                    uniqueKey="id"
                    subKey="children"
                    selectText="Valores"
                    showDropDowns={true}
                    single={false}
                    {...rest}
                    //onSelectedItemsChange={this.onSelectedItemsChange}
                    //selectedItems={this.state.selectedItems}
                />
            </View>
        </View>
      );

}

CheckboxGroup.propTypes = {
    type: PropTypes.string,
    show: PropTypes.bool,
    title: PropTypes.string,
    needed: PropTypes.bool,
    items: PropTypes.array,
    disabledInput: PropTypes.bool,
}

export default CheckboxGroup;