"use client"

import {useMutation, useQuery} from "convex/react";
import {Doc, Id} from "@/convex/_generated/dataModel";
import {api} from "@/convex/_generated/api";
import {useApiMutation} from "@/hooks/use-api-mutation";
import {useRouter} from "next/navigation";
import {useAuth} from "@clerk/nextjs";
import {FormEvent, useRef, useState} from "react";
import {toast} from "sonner";

interface EditPageProps {
  params: {
    gigId: string;
  }
}

const Edit = ({params}: EditPageProps) => {
  const gig = useQuery(api.gig.get, {id: params.gigId as Id<'gigs'>})
  const published = useQuery(api.gig.isPublished, {id: params.gigId as Id<'gigs'>})

  const {
    mutate: remove,
    pending: removePending,
  } = useApiMutation(api.gig.remove)

  const {
    mutate: publish,
    pending: publishPending
  } = useApiMutation(api.gig.publish)

  const {
    mutate: unpublish,
    pending: unpublishPending
  } = useApiMutation(api.gig.unpublish)

  const router = useRouter()

  const identity = useAuth()

  const generateUploadUrl = useMutation(api.gigMedia.generateUploadUrl)

  const imageInput = useRef<HTMLInputElement>(null)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const sendImage = useApiMutation(api.gigMedia.sendImage)

  if(!identity) {
    throw new Error('Unauthorized')
  }

  if(
      gig === undefined ||
      published === undefined
  ) {
    return null
  }

  if(gig === null) {
    return <div>Not Found</div>
  }

  async function handleSendImage(event: FormEvent) {
    event.preventDefault()

    if(gig === undefined) return

    const nonNullableGig = gig as Doc<'gigs'>

    const postUrl = await generateUploadUrl()

    await Promise.all(selectedImages.map(async (image) => {
      const result = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': image.type },
        body: image,
      })

      const json = result.json()

      if(!result.ok) throw new Error(`Upload failed: ${JSON.stringify(json)} `)

      const {storageId} = json

      await sendImage({storageId, format: 'image', gigId: nonNullableGig._id})
          .catch((error) => {
            console.log(error)
            toast.error('Maximum 5 files reached.')
          })
    }))

    setSelectedImages([])
    imageInput.current!.value = ''
  }


  const onPublish = async () => {
    console.log(published)
    if(!published) {
      publish({id: params.gigId as Id<'gigs'>})
          .catch(error => {
            console.log(error)
            toast.error('Failed to publish, Please make sure there are at least 1 image, 3 offers and a description.')
          })
    }
  }
}
