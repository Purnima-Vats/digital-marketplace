import { Card } from '@/components/ui/card'
import SellForm from '../components/forms/SellForm'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

const SellRoute = async () => {
    const {getUser} = getKindeServerSession()

    const user = await getUser()

    if(!user) {
        throw new Error("Not Authorized")
    }

    return (
        <section className='max-w-7xl mx-auto px-4 md:px-8 mb-14'>
            <Card>
                <SellForm/>
            </Card>
        </section>
    )
}

export default SellRoute