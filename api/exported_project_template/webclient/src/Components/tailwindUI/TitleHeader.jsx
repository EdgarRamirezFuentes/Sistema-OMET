import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

function TitleHeader({ steps, setStep, currentStep }) {
    let history = useHistory();
    const [currentTitle, setCurrentTitle] = useState('');

    const getTitleStep = () => {
        steps.forEach(step => {
            if(step.id === currentStep){
                setCurrentTitle(step.name)
            }
        });
    }

    const handleBackStep = () => {
        const route = steps[0].route || '/';
        currentStep === 1 ? 
            history.push(route)
            :
            setStep(currentStep - 1)
    }

    useEffect(() => {
    getTitleStep();
    return () => {
        setCurrentTitle('')
    }
    }, []);
    
    useEffect(() => {
    getTitleStep();
    return () => {
        setCurrentTitle('')
    }
    }, [currentStep])
    

    return (
        <div className='text-white lg:text-gray-900 font-medium text-xl md:text-3xl xl:text-4xl flex gap-2 items-center'>
            <ArrowLeftIcon className='w-10 md:w-12 h-10 md:h-12 cursor-pointer' onClick={ handleBackStep }/> { currentTitle }
        </div>
    )
}

TitleHeader.propTypes = {
    steps: PropTypes.array,
    setStep: PropTypes.func,
    currentStep: PropTypes.number,
}

export default TitleHeader