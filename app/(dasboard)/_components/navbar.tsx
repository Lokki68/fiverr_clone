"use client"

import * as React from 'react'
import Link from 'next/link'
import {api} from "@/convex/_generated/api";
import {useQuery} from "convex/react";
import {useRouter, useSearchParams} from "next/navigation";
import { Separator } from '@/components/ui/separator';
import {Loading} from "@/components/auth/loading";
import {SearchInput} from "@/app/(dasboard)/_components/search-input";
import {Dialog, DialogClose, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {TooltipProvider} from "@/app/(dasboard)/_components/tooltip-provider";
import {Filter, Heart, MessageCircle} from 'lucide-react';
import {Button} from "@/components/ui/button";
import {ListItem} from "@/app/(dasboard)/_components/list-item";
import {ScrollArea} from "@/components/ui/scroll-area";
import {SignInButton, SignUpButton} from "@clerk/nextjs";

const Navbar = () => {
  const categories = useQuery(api.categories.get)
  const currentUser = useQuery(api.users.getCurrentUser)
  const searchParams = useSearchParams()
  const favorites = searchParams.get('favorites')
  const filter = searchParams.get('filter')

  const router = useRouter()

  if(!categories) return <Loading />

  const onClickInbox = () => router.push('/inbox')

  const clearFilters = () => router.push('/')

  return (
      <>
        <Separator />
        <div className='flex items-center gap-x-4 p-5 bg-white'>
          <div className='hidden lg:flex lg:flex-1'>
            <SearchInput />
          </div>

          <Dialog>
            <DialogTrigger>
              <TooltipProvider
                text='Filter'
              >
                <Filter/>
              </TooltipProvider>
            </DialogTrigger>
            <ScrollArea
              className='rounded-md border'
            >
              <DialogContent>
                <DialogClose>
                  <>
                    <Button
                        onClick={clearFilters}
                        variant='ghost'
                        className='text-red-500'
                        disabled={!filter}
                    >
                      Clear filters
                    </Button>
                    {
                      categories.map((category, index) => (
                          <div
                              key={index}
                              className='p-4 bg-white rounded-lg shadow-md'
                          >
                            <h3
                                className='text-lg font-semibold mb-4'
                            >
                              {category.name}
                            </h3>
                            <div className='space-x-2'>
                              {
                                category.subcategories.map((subcategory, subIndex) => (
                                    <ListItem
                                        key={subIndex}
                                        title={subcategory.name}
                                        subcategory={subcategory}
                                    />
                                ))
                              }
                            </div>
                          </div>
                      ))
                    }
                  </>
                </DialogClose>
              </DialogContent>
            </ScrollArea>
          </Dialog>
          { currentUser && (
              <>
                <TooltipProvider text='favorites' >
                  <Button
                    asChild
                    variant={favorites ? "secondary" : "ghost"}
                    size='lg'
                    className='p-4'
                  >
                    <Link
                      href={{
                        pathname: '/',
                        query: favorites ? {} : {favorites: true}
                      }}
                      className='p-0'
                    >
                      <Heart className={favorites ? 'fill-black' : ''} />
                    </Link>
                  </Button>
                </TooltipProvider>

                <TooltipProvider
                  title='Inbox'
                >
                  <Button
                    onClick={onClickInbox}
                    variant='ghost'
                  >
                    <MessageCircle />
                  </Button>
                </TooltipProvider>

                <Button
                    onClick={() => router.push(`/seller/${currentUser.username}/manage-gigs`)}
                >
                  Switch to Selling
                </Button>

                {
                  !currentUser.stripeAccountSetupComplete &&
                  (
                      <>
                        <p>ConnectStripe</p>
                        {/*<ConnectStripe/>*/}
                      </>
                  )
                }

              </>
          ) }
          { !currentUser && (
              <>
                <Button
                  variant='default'
                  asChild
                >
                  <SignUpButton mode='modal' />
                </Button>

                <Button
                    variant='ghost'
                    asChild
                >
                  <SignInButton mode='modal' />
                </Button>
              </>
          ) }
        </div>
        <Separator/>
      </>
  )
}

export default Navbar