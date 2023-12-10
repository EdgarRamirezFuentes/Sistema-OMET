import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from 'react-native-heroicons/outline';



function Alert({ type, show, title, description, onClose }) {
    
    const [showAlert, setShowAlert] = useState(show);

    const bgColorFor = {
        'Success': 'bg-green-50',
        'Warning': 'bg-yellow-50',
        'Error': 'bg-red-50',
        'Info': 'bg-blue-50'
    };

    const titleColorFor = {
        'Success': 'text-green-800',
        'Warning': 'text-yellow-800',
        'Error': 'text-red-800',
        'Info': 'text-blue-800'
    };

    const descriptionColorFor = {
        'Success': 'text-green-700',
        'Warning': 'text-yellow-700',
        'Error': 'text-red-700',
        'Info': 'text-blue-700'
    };

    const closeButtonColorFor = {
        'Success': 'bg-green-600 text-green-500',
        'Warning': 'bg-yellow-600 text-yellow-500',
        'Error': 'bg-red-600 text-red-500',
        'Info': 'bg-blue-600 text-blue-500'
    };

    const iconFor = {
        'Success': <CheckCircleIcon color={"green"} size={25}/>,
        'Warning': <ExclamationCircleIcon color={"orange"} size={25} />,
        'Error': <XCircleIcon color={"red"} size={25}/>,
        'Info': <InformationCircleIcon color={"blue"} size={25}/>
    }

    useEffect(() => {
        setShowAlert(show);
    }, [show]);

    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);
                onClose && onClose()
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    return (
        <View>  
        {showAlert?<View className={`${bgColorFor[type]} rounded-md shadow-md w-full h-10 justify-center`}>
            <View className="flex flex-row">
                <View className="flex-shrink-0">
                    {iconFor[type]}
                </View>
                <View className="ml-3">
                    <Text className={`${titleColorFor[type]} text-sm font-medium`}>{title}</Text>
                    {description && (
                        <Text className={`${descriptionColorFor[type]} mt-2 text-sm`}>
                            {description}
                        </Text>
                    )}
                </View>
                <View className="ml-auto">
                    <TouchableOpacity
                        onPress={() => {setShowAlert(false);onClose && onClose()}}
                        className={`${closeButtonColorFor[type]}`}>
                            <XMarkIcon color={"white"} size={25}/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>:<></>}
        </View>
    );
}

Alert.propTypes = {
    type: PropTypes.oneOf(['Success', 'Warning', 'Error', 'Info']),
    show: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    onClose: PropTypes.func
};

Alert.defaultProps = {
    type: 'Error',
    show: false
};

export default Alert;
