import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const PaymentCancel = () => {
  return (
    <div className="flex w-full min-h-screen flex-1 items-center justify-center">
    <Card className="w-[350px]">
      <div className="p-6">
        <div className="w-full flex justify-center">
          <X className="size-12 p-2 bg-red-500/30 text-red-500 rounded-full" />
        </div>
        <div className="mt-3 text-center sm:mt-5 w-full">
          <h2 className="text-xl font-semibold">Payment Cancelled</h2>
          <p className="text-sm mt-2 text-muted-foreground tracking-tight text-balance">
            No worries, you wont be charged, please try again
          </p>
          <Button asChild className="w-full mt-5">
            <Link href={"/"}>Go back to Homepage</Link>
          </Button>
        </div>
      </div>
    </Card>
  </div>
  )
}

export default PaymentCancel