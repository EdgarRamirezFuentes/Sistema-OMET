import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { CheckIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function StepBar({ steps, setSteps, currentStep, setCurrentStep }) {
    const updateSteps = () => {
        const newSteps = steps.map(step => {
            if(step.id < currentStep){
                return {
                    ...step,
                    status: 'complete'
                }
            } else if(step.id == currentStep){
                return {
                    ...step,
                    status: 'current'
                }
            } else if(step.id > currentStep && step.id <= steps.length) {
                return {
                    ...step,
                    status: 'upcoming'
                }
            }
        });
        setSteps(newSteps);
    }

    const handleBackStep = (step) => {
        step.id == (currentStep - 1) && setCurrentStep(step.id);
    }

    useEffect(() => {
    updateSteps();
    }, [currentStep]);
    
    return (
        <nav aria-label="Progress" className='w-full'>
            <ol role="list" className="flex items-center">
                {steps.map((step, stepIdx) => (
                <li key={step.name} className={classNames(stepIdx !== steps.length - 1 ? 'w-full' : '', 'relative')}>
                    {step.status === 'complete' ? (
                    <>
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="h-0.5 w-full bg-v2-blue-text-login" />
                        </div>
                        <button className="relative flex h-8 w-8 items-center justify-center rounded-full bg-v2-blue-text-login" onClick={() => handleBackStep(step)}>
                            <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                            <span className="sr-only">{step.name}</span>
                        </button>
                    </>
                    ) : step.status === 'current' ? (
                    <>
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="h-0.5 w-full bg-gray-200" />
                        </div>
                        <button className="cursor-default relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-v2-blue-text-login bg-white" aria-current="step" onClick={() => handleBackStep(step)}>
                            <span className="h-2.5 w-2.5 rounded-full bg-v2-blue-text-login" aria-hidden="true" />
                            <span className="sr-only">{step.name}</span>
                        </button>
                    </>
                    ) : (
                    <>
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="h-0.5 w-full bg-gray-200" />
                        </div>
                        <button className="cursor-default group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400" onClick={() => handleBackStep(step)}>
                            <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" aria-hidden="true" />
                            <span className="sr-only">{step.name}</span>
                        </button>
                    </>
                    )}
                </li>
                ))}
            </ol>
        </nav>
    )
}

StepBar.propTypes = {
    steps: PropTypes.array,
    setSteps: PropTypes.func,
    currentStep: PropTypes.number,
    setCurrentStep: PropTypes.func
}

export default StepBar