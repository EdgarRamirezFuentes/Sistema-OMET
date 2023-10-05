import React from 'react';
import PropTypes from 'prop-types';
import SkeletonLoader from './SkeletonLoader';

function Stats({ items, cols, isLoading }) {

    return (
        <div>
            <dl className={`gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${cols}`}>
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="relative overflow-hidden rounded-lg bg-white p-4 shadow">
                        {isLoading ? (
                            <div className='w-1/2 pb-4'>
                                <SkeletonLoader />
                            </div>
                        ) : (
                            <dt>
                                {item.icon &&
                                    <div className="absolute rounded-md bg-button-orange p-3">
                                        <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                }
                                <p className={`${item.icon ? 'ml-14' : ''} truncate text-sm font-medium text-gray-500`}>{item.name}</p>
                            </dt>
                        )}
                        <dd className={`${item.icon ? 'ml-14' : ''} flex items-baseline`}>
                            {isLoading ? (
                                <SkeletonLoader />
                            ) : (
                                <>
                                    <p className="text-xl font-semibold text-gray-900">{item.stat}</p>
                                    {item.change &&
                                        <p className={`${item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'} ml-1 flex items-baseline text-sm font-semibold`}>
                                            {item.change}
                                        </p>
                                    }
                                </>
                            )}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    )
}

Stats.propTypes = {
    items: PropTypes.array,
    cols: PropTypes.string,
    isLoading: PropTypes.bool
}

Stats.defaultProps = {
    items: [],
    cols: '',
    isLoading: false
}

export default Stats;