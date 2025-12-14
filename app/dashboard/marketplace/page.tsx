"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Star, MapPin, Filter } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

interface Listing {
  id: string
  title: string
  description: string
  price: number
  category: string
  condition: string
  images: string[]
  location: string
  featured: boolean
  views: number
  user_id: string
  created_at: string
}

export default function MarketplacePage() {
  const supabase = createClient()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    loadListings()
  }, [selectedCategory])

  const loadListings = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from("marketplace_listings")
        .select("*")
        .eq("status", "active")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false })

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory)
      }

      const { data, error } = await query

      if (error) throw error
      setListings(data || [])
    } catch (error: any) {
      console.error("Error loading listings:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const categories = ["all", "books", "manga", "comics", "textbooks", "accessories"]

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Marketplace</h2>
          <p className="text-muted-foreground">Buy and sell books with fellow readers</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/marketplace/create">
            <Plus className="w-4 h-4 mr-2" />
            List Item
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="capitalize"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted" />
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredListings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No listings found. Be the first to list an item!</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/marketplace/create">
                <Plus className="w-4 h-4 mr-2" />
                Create Listing
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
            >
              <Card className="h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow">
                <Link href={`/dashboard/marketplace/${listing.id}`}>
                  <div className="relative h-48 w-full bg-muted">
                    {listing.images && listing.images.length > 0 ? (
                      <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}
                    {listing.featured && (
                      <Badge className="absolute top-2 right-2 bg-primary">Featured</Badge>
                    )}
                  </div>
                  <CardContent className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg line-clamp-2">{listing.title}</h3>
                      <Badge variant="outline" className="ml-2 capitalize">{listing.condition}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                      {listing.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <p className="text-2xl font-bold">${listing.price}</p>
                        {listing.location && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {listing.location}
                          </p>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {listing.views} views
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

