import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { TrashIcon, ClipboardIcon, EyeIcon, CircleStackIcon, XMarkIcon } from 'react-native-heroicons/outline';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';

const DynamicTable = ({ data, header, onView, onUpdate, onDelete}) => {

  const renderActions = (id) => (
    <View className={"flex flex-row "}>
      <TouchableOpacity className={"mr-1 bg-black inline-flex items-center justify-center px-4 py-2 border font-medium rounded-md"} onPress={()=>{onView(id)}}>
        <EyeIcon color={"white"} size={25}/>
      </TouchableOpacity>
      <TouchableOpacity className={"mr-1 bg-black transition-all inline-flex items-center justify-center px-4 py-2 border shadow-sm text-base font-medium rounded-md"} onPress={()=>{onUpdate(id)}}>
        <ClipboardIcon color={"white"} size={25}/>
      </TouchableOpacity>
      <TouchableOpacity className={"bg-black transition-all inline-flex items-center justify-center px-4 py-2 border shadow-sm text-base font-medium rounded-md"} onPress={()=>{onDelete(id)}}>
        <TrashIcon color={"white"} size={25}/>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="w-full flex flex-col p-5 bg-white  rounded-md">
      <View className={"w-full flex flex-row"}>
        <Text className={"mr-10 text-base font-bold"}>ID</Text>
        <Text className={"w-24 text-base font-bold"}>{header}</Text>
        <Text className={"w-20 text-base font-bold"}>Acciones</Text>
      </View>
      <ScrollView className={"w-full"}>
      {data.map((item, index) => (
        <View key={index} className={"flex flex-row w-full pt-2 pb-2 border-b rounded-l-lg items-center rounded overflow-hidden"}>
          <Text className={"mr-12"}>{item.id}</Text>
          <Text className={"mr-8 w-16"}>{item.nombre}</Text>
          {renderActions(item.id)}
        </View>
      ))}
      </ScrollView>
    </View>
  );
};

DynamicTable.propTypes = {
  dataTable: PropTypes.array,
  header: PropTypes.string,
  onView: PropTypes.func,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
}

DynamicTable.defaultProps = {
  header: 'Nombre',
}

export default DynamicTable;