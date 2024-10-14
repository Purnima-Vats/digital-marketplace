"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { JSONContent } from '@tiptap/react'
import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { toast } from 'sonner'
import { SellProduct, State } from '../actions'
import { TipTapEditor } from '../components/Editor'
import SelectCategory from '../components/SelectCategory'
import SubmitButton from '../components/SubmitButton'
import { UploadDropzone } from '../lib/uploadthing'
import { redirect } from 'next/navigation'

const SellRoute = () => {
    const initialState: State = {message: "", status: undefined}
    const [state, formAction] = useFormState(SellProduct, initialState)
    const [json, setJson] = useState<null | JSONContent>({})
    const [images, setImages] = useState<null | string[]>(null)
    const [productFile, setProductFile] = useState<null | string>(null)

    useEffect(() => {
        if(state.status === "success"){
            toast.success(state.message)
            redirect("/")
        } else if(state.status === "error"){
            toast.error(state.message)
        }
    }, [ state ] )
    return (
        <section className='max-w-7xl mx-auto px-4 md:px-8 mb-14'>
            <Card>
                <form action={formAction}>
                    <CardHeader>
                        <CardTitle>Sell your product with ease</CardTitle>
                        <CardDescription>
                            Please describe your product here in detail so that it can be sold
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='flex flex-col gap-y-10'>
                        <div className='flex flex-col gap-y-2'>
                            <Label>Name</Label>
                            <Input 
                                name="name"
                                type="text" 
                                placeholder="Name of your product"
                                required
                                minLength={3}
                                />
                            {state?.errors?.["name"]?.[0] && (
                                <p className='text-sm text-destructive'>
                                    {state?.errors?.["name"]?.[0]}
                                </p>
                            )}
                        </div>
                        <div className='flex flex-col gap-y-2'>
                            <Label>Category</Label>
                            <SelectCategory/>
                            {state?.errors?.["category"]?.[0] && (
                                <p className='text-sm text-destructive'>
                                    {state?.errors?.["category"]?.[0]}
                                </p>
                            )}
                        </div>
                        <div className='flex flex-col gap-y-2'>
                            <Label>Price</Label>
                            <Input 
                            required
                            min={1}
                            name="price" 
                            type="number" 
                            placeholder="10$"/>
                            {state?.errors?.["price"]?.[0] && (
                                <p className='text-sm text-destructive'>
                                    {state?.errors?.["price"]?.[0]}
                                </p>
                            )}
                        </div>
                        <div className='flex flex-col gap-y-2'>
                            <Label>Small Summary</Label>
                            <Textarea
                                required
                                minLength={10} 
                                name="smallDescription"
                                placeholder="Please describe your product shortly here..." rows={3}/>
                            {state?.errors?.["smallDescription"]?.[0] && (
                                <p className='text-sm text-destructive'>
                                    {state?.errors?.["smallDescription"]?.[0]}
                                </p>
                            )}
                        </div>

                        <div className='flex flex-col gap-y-2'>
                            <input 
                                type="hidden" 
                                name="description"
                                value={JSON.stringify(json)}
                            />
                            <Label>Description</Label>
                            <TipTapEditor setJson={setJson} json={json}/>
                            {state?.errors?.["description"]?.[0] && (
                                <p className='text-sm text-destructive'>
                                    {state?.errors?.["description"]?.[0]}
                                </p> 
                            )}
                        </div>

                        <div className='flex flex-col gap-y-2'>
                            <input 
                                type="hidden" 
                                name="images" 
                                value={JSON.stringify(images)}
                            />
                            <Label>Product Images</Label>
                            <UploadDropzone 
                            onClientUploadComplete={(res) => {
                                setImages(res.map((item) => item.url))
                                toast.success("Your images have been uploaded successfully")
                            }}
                            onUploadError={() => {
                                toast.error("Could not upload your images, please try again")
                            }}
                            endpoint="imageUploader"/>
                            {state?.errors?.["images"]?.[0] && (
                                <p className='text-sm text-destructive'>
                                    {state?.errors?.["images"]?.[0]}
                                </p> 
                            )}
                        </div>

                        <div className='flex flex-col gap-y-2'>
                            <input 
                                name="productFile"
                                type="hidden" 
                                value={productFile ?? ""}
                            />
                            <Label>Product File</Label>
                            <UploadDropzone 
                            onClientUploadComplete={(res) => {
                                setProductFile(res[0].url)
                                toast.success("Your file has been uploaded successfully")
                            }}
                            endpoint="productFileUploader"
                            onUploadError={() => {
                                toast.error("Could not upload your file, please try again")
                            }}
                            />
                            {state?.errors?.["productFile"]?.[0] && (
                                <p className='text-sm text-destructive'>
                                    {state?.errors?.["productFile"]?.[0]}
                                </p> 
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className='mt-5'>
                        <SubmitButton title="Create Product"/>
                    </CardFooter>
                </form>
            </Card>
        </section>
    )
}

export default SellRoute