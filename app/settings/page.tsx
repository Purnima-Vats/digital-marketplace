import { Card } from '@/components/ui/card'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import React from 'react'
import prisma from '../lib/db'
import SettingsForm from '../components/SettingsForm'

const getData = async (userId: string) => {
    const data = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            firstName: true,
            lastName: true,
            email: true
        }
    })

    return data;
}

const SettingsPage = async() => {
    const {getUser} = getKindeServerSession()
    const user = await getUser();

    if(!user){
        throw new Error("Not Authorized!");
    }

    const data = await getData(user.id);

    return (
        <section className='max-w-7xl mx-auto px-4 md:px-8'>
            <Card>
                <SettingsForm
                    firstName={data?.firstName as string}
                    lastName={data?.lastName as string}
                    email={data?.email as string}
                />
            </Card>
        </section>
    )
}

export default SettingsPage