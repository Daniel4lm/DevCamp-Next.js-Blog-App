"use client"

import React, { useState } from 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ProviderType } from '@/context/types'


function ReactQueryProvider({ children }: ProviderType) {

    const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } }))

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen />
        </QueryClientProvider>
    )
}

export default ReactQueryProvider
