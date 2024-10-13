"use client"

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {Menu } from 'lucide-react'
import React from 'react'
import { navbarLinks } from './NavbarLinks'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const MobileMenu = () => {
    const location = usePathname();
    return (
        <Sheet>
            <SheetTrigger>
                <Menu className="h-4 w-4"/>
            </SheetTrigger>
            <SheetContent>
                <div className='flex flex-col mt-5 px-2 space-y-1'>
                    {navbarLinks.map((item) => (
                        <Link href={item.href} key={item.id} className={cn(
                            location === item.href ? "bg-muted" 
                            : "hover:bg-muted hover:bg-opacity-75", 
                            "group flex items-center px-2 py-2 font-medium rounded-md"
                        )}>
                            {item.name}
                        </Link>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default MobileMenu