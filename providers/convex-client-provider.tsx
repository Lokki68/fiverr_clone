"use client"

import React from "react";
import {ClerkProvider, useAuth} from '@clerk/nextjs'
import {
    AuthLoading,
    Authenticated,
    Unauthenticated,
    ConvexReactClient
} from 'convex/react'
import {ConvexProviderWithClerk} from 'convex/react-clerk'

import {Loading} from '@/components/auth/loading'

interface ConvexClientProviderProps {
  children: React.ReactNode
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!

const convex = new ConvexReactClient(convexUrl)

export const ConvexClientProvider: React.FC<ConvexClientProviderProps> = ({children}) => {
  return (
      <ClerkProvider>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <Unauthenticated>
            {children}
          </Unauthenticated>
          <Authenticated>
            {children}
          </Authenticated>
          <AuthLoading>
            <Loading/>
          </AuthLoading>
        </ConvexProviderWithClerk>
      </ClerkProvider>
  )
}