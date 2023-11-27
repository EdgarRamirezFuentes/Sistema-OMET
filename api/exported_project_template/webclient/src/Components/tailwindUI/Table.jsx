import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { EllipsisVerticalIcon, InformationCircleIcon } from '@heroicons/react/20/solid';
import MenuButton from './MenuButton';
//import ReactTooltip from 'react-tooltip';
import SkeletonLoader from './SkeletonLoader';
import PrimaryButton from './PrimaryButton';
import Badge from './Badge';
import SecondaryButton from './SecondaryButton';
//import DateBadge from './DateBadge';

function Table({ title, columns, data, isLoadingData, actions, label }) {

    const [showTooltip, setShowTooltip] = useState(true);
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        if (actions && actions.length > 1) {
            setMenuItems(data?.map(item =>
                actions.map(actionItem => {
                    return {
                        name: actionItem.name,
                        action: () => actionItem.action(item)
                    }
                })
            ))
        }
    }, [data, actions]);

    return (
        <div className="shadow ring-1 ring-black ring-opacity-5 md:mx-0 rounded-lg">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <table className="min-w-full divide-y divide-gray-300 bg-white rounded-lg" >
                <thead className="bg-transparent">
                    <tr className=''>
                        {columns.map((item, i) => (
                            <th key={item.heading} scope="col" className={`${i == 0 ? 'block' : 'hidden'} ${item.align ? `text-${item.align}` : ''} lg:table-cell py-3 pl-4 pr-3 text-left text-xs uppercase font-medium tracking-wide bg-gray-50 text-gray-500 first:rounded-tl-lg last:rounded-tr-lg`}>
                                {title != null ? (
                                    <>
                                        <span className='block lg:hidden'>{title}</span>
                                        <span className='hidden lg:block'>{item.heading}</span>
                                    </>
                                ) : (
                                    <>{item.heading}</>
                                )}
                            </th>
                        ))}
                        {actions.length > 0 && (
                            <th scope="col" className="bg-gray-50 relative py-3.5 pl-3 pr-4 first:rounded-tl-lg last:rounded-tr-lg">
                                <span className="sr-only">Acciones</span>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200  ">
                    {isLoadingData ? (
                        <>
                            {Array.from({ length: 5 }).map((_, i) =>
                                <TableRowLoading
                                    key={i}
                                    column={columns}
                                    actionItems={actions}
                                    isLast={i == data.length - 1} />

                            )}
                        </>
                    ) : (
                        <>
                            {data.map((item, i) => (
                                <TableRow
                                    key={i}
                                    item={item}
                                    column={columns}
                                    isLast={i == data.length - 1}
                                    setShowTooltip={setShowTooltip}
                                    actions={actions}
                                    actionItems={menuItems[i]}
                                    />
                            ))}
                        </>
                    )}
                </tbody>
            </table>

        </div>
    )
}

const valueFor = (item, columnItemValue) => {
    let value = item[`${columnItemValue}`];
    if (columnItemValue?.includes(',')) {
        //To concatenate values
        const itemSplit = columnItemValue?.split(',');
        let values = [];
        itemSplit.forEach(key => {
            let val = item[key]
            if (key.includes('.')) {
                //For nested values
                const keySplit = key.split('.');
                val = item?.[keySplit[0]]?.[keySplit[1]];
            }
            values.push(val);
        });
        value = values.join(' - ');
    } else if (columnItemValue?.includes('.')) {
        //For nested values
        const itemSplit = columnItemValue?.split('.');
        value = item?.[itemSplit[0]]?.[itemSplit[1]];
    } else if (columnItemValue === 'price') {
        value = (value / 100);
    }
    return value;
}

const TableRow = ({ item, column, isLast, setShowTooltip, actions, actionItems }) => (
    <tr>
        {column.map((columnItem, i) => {
            if (columnItem.main) {
                return (
                    <td key={i} className={`w-full max-w-0 py-2.5 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none overflow-hidden`}>
                        <div className='w-full h-full flex'>
                            <div className='hidden lg:inline'>
                                <span>{valueFor(item, columnItem.value)}</span>
                                {columnItem.subvalue !== null && columnItem.subvalue !== undefined &&
                                    <div className='text-gray-500 text-sm font-normal'>
                                        { valueFor(item, columnItem.subvalue) }
                                    </div>
                                }
                            </div>
                            {columnItem.description && (
                                <InformationCircleIcon
                                    className='hidden lg:inline-block ml-2 cursor-pointer w-5 h-5 text-gray-300'
                                    data-for="tooltip"
                                    data-tip={valueFor(item, columnItem.description)}
                                    onMouseEnter={() => setShowTooltip(true)}
                                    onMouseLeave={() => {
                                        setShowTooltip(false);
                                        setTimeout(() => setShowTooltip(true), 50);
                                    }} />
                            )}
                        </div>
                        <dl className="font-normal lg:hidden -mt-4 " onClick={(e) => e.stopPropagation()}>
                            {column.map((columnItem, i) => {
                                return (
                                    <div key={i}>
                                        <dt className='mt-4 text-gray-500'>{columnItem.heading}:</dt>
                                        <dd className="text-gray-900">
                                            { columnItem.badge ?
                                                <Badge text={valueFor(item, columnItem.mobile_value || columnItem.value)} />
                                            : columnItem.dateBadge ?
                                                <DateBadge date={ valueFor(item, columnItem.mobile_value || columnItem.value) } />
                                            :
                                                <>{valueFor(item, columnItem.mobile_value || columnItem.value)}</>
                                            }
                                            {columnItem.subvalue !== null && columnItem.subvalue !== undefined &&
                                                <div className='text-gray-600'>
                                                    { valueFor(item, columnItem.subvalue) }
                                                </div>
                                            }
                                        </dd>
                                    </div>
                                )
                            })}
                        </dl>
                    </td>
                )
            }
            return (
                <td key={i} className={`${columnItem.align ? `text-${columnItem.align}` : ''} hidden py-3 pl-4 pr-3 text-sm text-gray-500 lg:table-cell align-center`}>
                        { columnItem.badge ?
                            <Badge text={valueFor(item, columnItem.value)} />
                        : columnItem.dateBadge ?
                            <DateBadge date={ valueFor(item, columnItem.value) } />
                        :
                            <>{valueFor(item, columnItem.value)}</>
                        }
                        {columnItem.subvalue !== null && columnItem.subvalue !== undefined &&
                            <div className='text-gray-600'>
                                { valueFor(item, columnItem.subvalue) }
                            </div>
                        }
                        {columnItem.description && (
                            <InformationCircleIcon
                                className='hidden lg:inline-block ml-2 cursor-pointer w-5 h-5 text-gray-300'
                                data-for="tooltip"
                                data-tip={valueFor(item, columnItem.description)}
                                onMouseEnter={() => setShowTooltip(true)}
                                onMouseLeave={() => {
                                    setShowTooltip(false);
                                    setTimeout(() => setShowTooltip(true), 50);
                                }} />
                        )}
                </td>
            )
        })}
        { actions.length > 0 && <td className={`${isLast ? 'relative' : 'z-1 flex justify-start sm:justify-end items-start'} hidden lg:table-cell`}>
            <div className='flex gap-3 justify-center'>
                {actions.map((btn) => (
                    <div key={btn.name}>
                        {btn.icon ? (
                            <div key={btn.name}>
                                {btn.type === 'primary' ?
                                    <PrimaryButton onClick={() => btn.action(item)}>
                                        { btn.icon }
                                    </PrimaryButton>
                                :
                                    <SecondaryButton onClick={ () => btn.action(item) } disabled={ btn.loading && item.id == btn.itemId }>
                                        {btn.loading && item.id == btn.itemId ?
                                            <div className="w-5 h-5 rounded-full flex justify-center text-white">
                                                <svg role="status" className="inline w-5 h-5 animate-spin fill-gray-700" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                </svg>
                                            </div>
                                            :
                                            <>{ btn.icon }</>
                                        }
                                    </SecondaryButton>
                                }
                            </div>
                        ) : (
                            <div key={btn.name} className='underline text-button-orange text-sm font-medium cursor-pointer' onClick={() => btn.action(item)}>
                                { btn.name }
                            </div>
                        )}
                    </div>
                ))
                }
            </div>
        </td>
        }
        { actions.length == 1 &&
            <td className={`rounded-lg z-1 flex justify-end items-start pt-4 px-3.5 text-sm font-medium block lg:hidden`}>
                { actions.map((btn) => (
                    <div key={btn.name} className='underline text-button-orange text-sm font-medium cursor-pointer' onClick={() => btn.action(item)}>
                        { btn.name }
                    </div>
                ))}
            </td>
        }
        { actions.length > 1 &&
            <td className='flex justify-end items-start lg:hidden pt-4 px-3.5 text-sm font-medium'>
                <div className='w-full flex justify-start items-start'>
                    <MenuButton
                        items={actionItems}>
                        <EllipsisVerticalIcon className="min-w-[1.25rem] w-5 h-5 text-gray-400" />
                    </MenuButton>
                </div>
            </td>
        }
    </tr>
)

const TableRowLoading = ({ column, actionItems, isLast }) => (
    <tr>
        {column.map((_, i) => {
            if (i == 0) {
                return (
                    <td key={i} className={`${isLast ? 'first:rounded-bl-lg last:rounded-br-lg' : ''} ${(isLast && actionItems.length == 0) ? 'rounded-br-lg lg:rounded-br-none' : ''} w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none lg:flex items-center`}>
                        <div className='hidden lg:inline w-full'>
                            <SkeletonLoader />
                        </div>
                        <dl className="font-normal lg:hidden -mt-2 ">
                            {column.map((columnItem, i) => {
                                return (
                                    <div key={i}>
                                        <dt className='mt-2 text-gray-500'>{columnItem.heading}:</dt>
                                        <SkeletonLoader />
                                    </div>
                                )
                            })}
                        </dl>
                    </td>
                )
            }
            return (
                <td
                    key={i}
                    className={`${isLast ? 'first:rounded-bl-lg last:rounded-br-lg' : ''} hidden py-4 pl-4 pr-3 text-sm text-gray-500 lg:table-cell align-middle`}>
                    <SkeletonLoader />
                </td>
            )
        })}
        {actionItems.length > 0 && (
            <td className={`${isLast ? 'relative' : 'sm:pr-6 z-1 flex justify-start sm:justify-end items-start'} pt-4 px-3.5 text-sm font-medium`}>
                {isLast && (<div className='min-w-[1.25rem] h-5' />)}
            </td>
        )}
    </tr>
)

Table.propTypes = {
    title: PropTypes.string,
    columns: PropTypes.arrayOf(PropTypes.object),
    data: PropTypes.arrayOf(PropTypes.object),
    isLoadingData: PropTypes.bool,
    actions: PropTypes.array,
}

TableRow.propTypes = {
    item: PropTypes.object,
    column: PropTypes.array,
    isLast: PropTypes.bool,
    setShowTooltip: PropTypes.func,
    actions: PropTypes.array,
    actionItems: PropTypes.array
}

TableRowLoading.propTypes = {
    column: PropTypes.array,
    actionItems: PropTypes.array,
    isLast: PropTypes.bool,
    label: PropTypes.string
}

Table.defaultProps = {
    title: 'Título',
    columns: [],
    data: [],
    isLoadingData: false,
    actions: [],
    label: ""
}

export default Table;
