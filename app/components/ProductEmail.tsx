import {Body, Button, Container, Head, Html, Preview, Section, Tailwind, Text} from "@react-email/components"

const ProductEmail = ({link}: {link: string}) => {
    return (
        <Html>
            <Head/>
            <Preview>
                Your product is here...
            </Preview>
            <Tailwind>
                <Body className="bg-white font-sans">
                    <Container style={container}>
                        <Text className="text-2xl font-semibold">
                            Hi, friend
                        </Text>
                        <Text className="text-lg text-gray-600">
                            Thank you for buying your product at HippoUI.
                        </Text>
                        <Section className="w-full flex justify-center mt-6">
                            <Button href={link}
                            className="text-white bg-blue-500 rounded-lg px-10 py-4">
                                Your Download Link
                            </Button>
                        </Section>
                        <Text className="text-lg">Best, <br/> HippoUI Team</Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
}

export default ProductEmail