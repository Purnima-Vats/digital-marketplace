"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

const SubmitButton = ({ title }: { title: string }) => {
    const { pending } = useFormStatus();

    return (
        <>
            {pending ? (
                <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                </Button>
            ) : (
                <Button type="submit">{title}</Button>
            )}
        </>
    );
};

export const BuyButton = ({ price }: { price: number }) => {
    const { pending } = useFormStatus();

    return (
        <>
            {pending ? (
                <Button disabled size="lg" className="w-full mt-10">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                </Button>
            ) : (
                <Button type="submit" size="lg" className="w-full mt-10">
                    Buy for ${price}
                </Button>
            )}
        </>
    );
};

export default SubmitButton;
