import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Navigation } from '../constants/Navigation'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

  
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const Navbar = () => {
    const location = useLocation()
    const [navigation,setNavigation] = useState(Navigation)
  return (
    <div>
        <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
            <>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <Link to='/' className="flex">
                            <img className="w-14 sm-hidden" src={'/Images/0.png'} alt="H_Logo" />    
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {
                                navigation.map((item)=>{
                                    if(item.link === location.pathname){
                                        item.current = true
                                    }else if(location.pathname === '/' && item.name === "Orders"){
                                        item.current = true
                                    }else{
                                        item.current = false
                                    }
                                    return null
                                })
                            }
                        {navigation.map((item,index) => (
                            <Link
                            key={item.name}
                            to={item.link}
                            className={classNames(
                                item.current
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'rounded-md px-3 py-2 text-sm font-medium'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                            onClick={()=>{
                                let activeLink = navigation
                                activeLink.forEach((x) => {
                                    if(x.current){
                                        x.current = false
                                    }
                                })
                                activeLink[index].current = true
                                setNavigation(activeLink)
                            }}
                            >
                            {item.name}
                            </Link>
                        ))}
                        </div>
                    </div>
                    </div>
                    <div className="hidden md:block">
                    </div>
                    <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                        )}
                    </Disclosure.Button>
                    </div>
                </div>
                </div>

                <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                    {navigation.map((item,index) => (
                    <Link
                        key={item.name}
                        to={item.link}
                        className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                        onClick={()=>{
                            let activeLink = navigation
                            activeLink.forEach((x) => {
                                if(x.current){
                                    x.current = false
                                }
                            })
                            activeLink[index].current = true
                            setNavigation(activeLink)
                        }}
                    >
                        {item.name}
                    </Link>
                    ))}
                </div>

                </Disclosure.Panel>
            </>
            )}
        </Disclosure>
    </div>
  )
}

export default Navbar