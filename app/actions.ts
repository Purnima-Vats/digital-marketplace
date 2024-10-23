"use server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { z } from "zod";
import prisma from "./lib/db";
import { type CategoryTypes } from "@prisma/client";
import { stripe } from "./lib/stripe";
import { redirect } from "next/navigation";

export type State = {
    status: "error" | "success" | undefined;
    errors?: {
        [key: string]: string[];
    };
    message?: string | null;
}

const productSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    category: z.string().min(1, { message: "Category is required" }),
    price: z.number().min(1, { message: "Price is required" }),
    smallDescription: z.string().min(10, { message: "Please summarise your product more." }),
    description: z.string().min(10, { message: "Description is required" }),
    images: z.array(z.string(), {message: "Images are required"}),
    productFile: z.string().min(1, { message: "File is required" }),
})

const userSettingsSchema = z.object({
    firstName: z
        .string()
        .min(3, { message: "Minimum length is 3" })
        .or(z.literal(""))
        .optional(),
    
    lastName: z
        .string()
        .min(3, { message: "Minimum length is 3" })
        .or(z.literal(""))
        .optional(),
})

export async function SellProduct(prevState: any, formData: FormData){
    const {getUser} = getKindeServerSession()
    const user = await getUser();

    if(!user){
        throw new Error("User not found");
    }

    const validateFields = productSchema.safeParse({
        name: formData.get("name"),
        category: formData.get("category"),
        price: Number(formData.get("price")),
        smallDescription: formData.get("smallDescription"),
        description: formData.get("description"),
        images: JSON.parse(formData.get("images") as string),
        productFile: formData.get("productFile"),
    })

    if(!validateFields.success){
        const state: State = { 
            status: "error",
            errors: validateFields.error.flatten().fieldErrors,
            message: "Oops! I think there is a mistake with your inputs..."
        }

        return state;
    }

    const data = await prisma.product.create({
        data: {
            name: validateFields.data.name,
            category: validateFields.data.category as CategoryTypes,
            price: validateFields.data.price,
            smallDescription: validateFields.data.smallDescription,
            description: JSON.parse(validateFields.data.description),
            images: validateFields.data.images,
            productFile: validateFields.data.productFile,
            userId: user.id
        }
    })

    return redirect(`/product/${data.id}`)
}

export async function UpdateUserSettings (prevStae: any, formData: FormData) {
    const {getUser} = getKindeServerSession()
    const user = await getUser()

    if(!user){
        throw new Error("User not found")
    }

    const validateFields = userSettingsSchema.safeParse({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName")
    });

    if(!validateFields.success){
        const state: State = {
            status: "error",
            errors: validateFields.error.flatten().fieldErrors,
            message: "Oops! I think there is a mistake with your inputs..."
        }

        return state;
    }

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            firstName: validateFields.data.firstName,
            lastName: validateFields.data.lastName
        },
    });

    const state: State = {
        status: "success",
        message: "Profile updated successfully!"
    }

    return state;
}

export async function BuyProduct (formData: FormData) {
    const id = formData.get("id") as string
    const data = await prisma.product.findUnique({
        where: {
            id: id,
        },
        select: {
            name: true,
            smallDescription: true,
            price: true,
            images: true,
            productFile: true,
            User: {
                select: {
                    connectedAccountId: true
                }
            }
        }
    });

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    unit_amount: Math.round(data?.price as number * 100) , 
                    product_data: {
                        name: data?.name as string,
                        description: data?.smallDescription,
                        images: data?.images
                    }
                },
                quantity: 1,
            }
        ],
        
        metadata: {
            link: data?.productFile as string,
        },

        payment_intent_data: {
            application_fee_amount: (Math.round(data?.price as number * 100)) * 0.1,
            transfer_data: {
                destination: data?.User?.connectedAccountId as string
            }
        }, 
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/cancel`,
    });

    return redirect(session.url as string)
}

export const CreateStripeAccountLink = async () => {
    const {getUser} = getKindeServerSession()

    const user = await getUser()

    if(!user) {
        throw new Error("Not authorized!")
    }

    const data = await prisma.user.findUnique({
        where: {
            id: user.id,
        },
        select: {
            connectedAccountId: true,
        }
    });

    const accountLink = await stripe.accountLinks.create({
        account: data?.connectedAccountId as string,
        refresh_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing`,
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/return/${data?.connectedAccountId}`,
        type: "account_onboarding"
    });

    return redirect(accountLink.url);
}

export const GetStripeDashboardLink = async () => {
    const {getUser} = getKindeServerSession()

    const user = await getUser()

    if(!user) {
        throw new Error("Not authorized!")
    }

    const data = await prisma.user.findUnique({
        where: {
            id: user.id,
        },
        select: {
            connectedAccountId: true,
        }
    });

    const loginLink = await stripe.accounts.createLoginLink(
        data?.connectedAccountId as string
    );

    return redirect(loginLink.url);
}