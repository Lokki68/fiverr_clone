"use client"

import {useEffect} from "react";
import {store} from "@/convex/users";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";

interface DashboardProps {
  searchParams: {
    search?: string;
    favorites?: string;
    filter?: string;
  }
}

const Dashboard = ({searchParams}: DashboardProps) => {

  const store = useMutation(api.users.store)

  useEffect(() => {
    const storeUser = async () => {
      await store({})
    }
    storeUser()
  }, [store]);

  console.log('store', store)
  return (
      <div>Dashboard</div>
  )
}

export default Dashboard