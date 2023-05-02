import axolote from '../../assets/axolote.png'
import React, { useState, useEffect, useMemo } from 'react';
import { Disclosure } from '@headlessui/react';
import { HomeIcon, ArrowRightOnRectangleIcon, ClipboardDocumentListIcon, UserGroupIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function SideBar({ user }) {

    const history = useNavigate();
    const location = useLocation();

    const [navigation, setNavigation] = useState([
        {
            id: 1,
            name: 'Inicio',
            icon: HomeIcon,
            current: true,
            route: '/home',
            paths: ['/home'],
        },
        {
            id: 2,
            name: 'Clientes',
            icon: UserGroupIcon,
            current: true,
            paths: ['/clients/create', '/clients/search'],
            children: [
                { id: 1, name: 'Crear', current: true, route: '/clients/create', paths: ['/clients/create']  },
                { id: 2, name: 'Buscar', current: false, route: '/clients/search', paths: ['/clients/search']},
            ],
        },
        {
            id: 3,
            name: 'Formularios',
            icon: ClipboardDocumentListIcon,
            current: true,
            paths: [ '/forms/create', '/forms/search'],
            children: [
                { id: 1, name: 'Crear', current: true, route: '/forms/create', paths: ['/forms/create']  },
                { id: 2, name: 'Buscar', current: false, route: '/forms/search', paths: ['/forms/get']},
            ],
        },
    ]);

    const changeCurrentNavigation = () => {
        const cleanedNav = navigation.map(nav => {
            if (nav.children) {
                const subItems = nav.children.map(subitem => {
                    return {
                        ...subitem,
                        current: subitem.paths.some(item => item == location.pathname || `${item}/${location.pathname.split('/').at(-1)}` == location.pathname)
                    }
                });
                return {
                    ...nav,
                    current: nav.paths.some(item => item == location.pathname || `${item}/${location.pathname.split('/').at(-1)}` == location.pathname),
                    children: subItems
                }
            } else {
                return {
                    ...nav,
                    current: nav.paths.some(item => item == location.pathname || `${item}/${location.pathname.split('/').at(-1)}` == location.pathname)
                }
            }
        });
        setNavigation(cleanedNav);
    }

    useEffect(() => {
        changeCurrentNavigation()
    }, [location.pathname]);

    useEffect(() => {
        if (user) {
            let path = location.pathname;
            const currentLocation = localStorage.getItem("current_location");
            if (currentLocation) {
                localStorage.removeItem("current_location");
                history.replace(currentLocation);
            } else if (path == "/") {
                history.replace(pathToReplace);
            }
        }
    }, []);

    const pathToReplace = useMemo(() => {
        let pathToReplace = "/";
        navigation.every(item => {
            if (item.children) {
                return item.children.every(children => {
                        pathToReplace = children.route;
                        return false;
                });
            } else {
                pathToReplace = item.route;
                return false;
            }
        });
        return pathToReplace;
    }, [user]);

    return (
        <div className="w-64 hidden lg:flex flex-grow flex-col min-h-0 h-screen sticky top-0 z-[10] overflow-y-auto bg-sky-500 pt-4 pb-4">
            <div className="flex flex-shrink-0 items-center justify-center">
            <img className='m-auto h-20 mt-2' src={axolote}/>
            </div>
            <div className="w-full pt-6 flex flex-grow flex-col overflow-y-auto">
                <nav className="flex-1 bg-v2-blue-text-login px-2" aria-label="Sidebar">
                    {navigation.map((item) =>
                        !item.children ? (
                                <Link to={item.route}>
                                    <div className={`${item.current ? 'bg-sky-600' : 'bg-sky-500 hover:bg-sky-400'} text-white group w-full flex items-center my-2 text-sm font-medium rounded-md cursor-pointer`}>
                                        <div className='group w-full flex items-center pl-2 py-2 text-sm font-medium rounded-md'>
                                            <item.icon className='mr-3 flex-shrink-0 h-6 w-6 text-white' aria-hidden="true" />
                                            {item.name}
                                        </div>
                                    </div>
                                </Link>
                        ) : (
                                <Disclosure as="div" key={item.name} className="space-y-1">
                                    {({ open }) => (
                                        <>
                                            <Disclosure.Button
                                                className={classNames(
                                                    item.current
                                                        ? 'bg-sky-600'
                                                        : 'bg-sky-500 hover:bg-sky-400',
                                                    'group w-full flex items-center text-white pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md'
                                                )}

                                            >
                                                <item.icon className="mr-3 h-6 w-6 flex-shrink-0 text-white" aria-hidden="true" />
                                                <span className="flex-1">{item.name}</span>
                                                <ChevronDownIcon className={classNames(open && 'rotate-180',
                                                    'h-5 w-5 flex-shrink-0 text-white transform transition-colors duration-150 ease-in-out'
                                                )} />
                                            </Disclosure.Button>
                                            <Disclosure.Panel className={`pl-5`} >
                                                {item.children.map((subItem) => (
                                                        <Link to={subItem.route}>
                                                            <div className={`${subItem.current ? 'bg-sky-600' : 'bg-sky-500 hover:bg-sky-400'} group flex w-full items-center rounded-md py-2 my-1.5 pl-6 pr-2 text-sm font-medium text-white`}>
                                                                {subItem.name}
                                                            </div>
                                                        </Link>

                                                ))}
                                            </Disclosure.Panel>
                                        </>
                                    )}
                                </Disclosure>
                        )
                    )}
                </nav>
            </div>
            <div className="flex flex-shrink-0 border-t border-gray-200 py-4 px-2">
                <div className="group block w-full flex-shrink-0">
                    <div className="flex items-center">
                        <div className='flex items-center justify-center h-12 w-12 rounded-full border border-white/30'>
                            <img
                                className="inline-block h-full w-full rounded-full"
                                src={user?.picture || axolote}
                            />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-white group-hover:text-white">{user?.givenName}</p>
                            <p className="text-xs font-medium text-white group-hover:text-white pt-1 -ml-[3px] cursor-pointer flex items-center gap-1 underline" onClick={() => {history('/')}}><ArrowRightOnRectangleIcon className='w-5 h-5' /> Cerrar sesión</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

SideBar.propTypes = {
    user: PropTypes.object
}

export default SideBar