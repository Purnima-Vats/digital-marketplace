import { AvatarFallback, Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components'

interface UserNavProps {
    name: string,
    email: string,
    userImage: string | undefined
}

const UserNav = ({ name, email, userImage }: UserNavProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} className='h-10 w-10 relative rounded-full'>
                    <Avatar className='h-10 w-10'>
                        <AvatarImage src={userImage} alt={name} />
                        <AvatarFallback>
                            {name.slice(0,3)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align="end" forceMount>
                <DropdownMenuLabel className='font-normal'>
                    <div className="flex flex-col space-y-1">
                        <p className='text-sm font-medium leading-none'>{name}</p>
                        <p className='text-xs leading-none text-muted-foreground'>{email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuGroup>
                    <DropdownMenuItem>Test Item</DropdownMenuItem>
                    <DropdownMenuItem>Test Item</DropdownMenuItem>
                    <DropdownMenuItem>Test Item</DropdownMenuItem>
                    <DropdownMenuItem>Test Item</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator/>
                <DropdownMenuItem asChild>
                    <LogoutLink>
                        Log out
                    </LogoutLink>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserNav