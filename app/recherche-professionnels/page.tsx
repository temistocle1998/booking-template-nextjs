// "use client"

import SearchResults from "@/search-bar-professionnels"
import { useState, useEffect, Suspense } from "react"


export default function RechercheProfessionnels() {
  return (
   <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        {/* Custom loading skeleton that matches your layout */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="h-10 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  )
}

