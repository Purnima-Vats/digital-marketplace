import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "../lib/db";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductRowProps {
    category: "newest" | "templates" | "uikits" | "icons" 
}

async function getData({category}: ProductRowProps) {
    switch(category){
        case "icons": {
            const data = await prisma.product.findMany({
                where: {
                    category: "icon"
                },
                select: {
                    price: true,
                    name: true,
                    smallDescription: true,
                    id: true,
                    images:true,
                },
                take: 3,
            })

            return {
                data: data,
                title: "Icons",
                link: "/products/icon",
            }
        }
        case "newest":{
            const data = await prisma.product.findMany({
                select: {
                    price: true,
                    name: true,
                    smallDescription: true,
                    id: true,
                    images:true,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 3,
            });

            return {
                data: data,
                title: "Newest Products",
                link: "/products/all",
            }
        }
        case "templates": {
            const data = await prisma.product.findMany({
                where: {
                    category: "template"
                },
                select: {
                    price: true,
                    name: true,
                    smallDescription: true,
                    id: true,
                    images:true,
                },
                take: 3,
            });

            return {
                data: data,
                title: "Templates",
                link: "/products/template",
            }
        }
        case "uikits": {
            const data = await prisma.product.findMany({
                where: {
                    category: "uikit"
                },
                select: {
                    id: true,
                    name: true,
                    price: true,
                    smallDescription: true,
                    images:true,
                },
                take: 3,
            });

            return {
                data: data,
                title: "UI Kits",
                link: "/products/uikit",
            }
        }
        default : {
            return notFound()
        }
    }
}

const ProductRow = ({category}: ProductRowProps) => {
    
    return (
        <section className="mt-12">
            <Suspense fallback={<LoadingState/>}>
                <LoadRows category={category}/>
            </Suspense>
        </section>
    )
}


export const LoadRows = async ({category}: ProductRowProps) => {
    const data = await getData({category: category})
    return (
        <>
            <div className="md:flex md:items-center md:justify-between">
                <h2 className="text-2xl font-extrabold tracking-tight">
                    {data.title}
                </h2>
                <Link className="text-sm hidden font-medium text-primary hover:text-primary md:block"
                href={data.link}>View all <span>&rarr;</span></Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 mt-4 gap-10">
                {data.data.map((product) => (
                    <ProductCard 
                        key={product.id} 
                        images={product.images} 
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        smallDescription={product.smallDescription}
                    />
                ))}
            </div>
        </>
    )
}

const LoadingState = () => {
    return (
        <div>
            <Skeleton className="h-8 w-56 "/>
            <div className="grid grid-cols-1 sm:grid-cols-2 mt-4 gap-10 lg:grid-cols-3">
                <ProductCardSkeleton/>
                <ProductCardSkeleton/>
                <ProductCardSkeleton/>
            </div>
        </div>
    )
}


export default ProductRow