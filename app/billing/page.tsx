import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import prisma from '../lib/db'
import { Button } from '@/components/ui/button'
import { CreateStripeAccountLink } from '../actions'
import SubmitButton from '../components/SubmitButton'


export const getData = async (userId: string) => {
    const data = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            stripeConnectedLinked: true,
        }
    })

    return data;
}


const BillingRoute = async () => {
    const {getUser } = getKindeServerSession()

    const user = await getUser();

    if(!user) {
        throw new Error ("Not Authorized")
    }

    const data = await getData(user.id)

    return (
        <section className="max-w-7xl mx-auto px-4 md:px-8">
            <Card>
                <CardHeader>
                    <CardTitle>Billing</CardTitle>
                    <CardDescription>
                        Find all your details regarding your payments.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {data?.stripeConnectedLinked === false && (
                        <form action={CreateStripeAccountLink}>
                            <SubmitButton title="Link your Account to stripe"/>
                        </form>
                    )}
                </CardContent>
            </Card>
        </section>
    )
}

export default BillingRoute