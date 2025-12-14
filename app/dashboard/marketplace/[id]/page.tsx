"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Eye, Mail, MessageSquare, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"

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
  profiles?: {
    full_name?: string
    email?: string
    avatar_url?: string
  }
}

export default function MarketplaceListingPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [contacting, setContacting] = useState(false)

  useEffect(() => {
    if (params.id) {
      loadListing()
    }
  }, [params.id])

  const loadListing = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("marketplace_listings")
        .select(`
          *,
          profiles:user_id (
            full_name,
            email,
            avatar_url
          )
        `)
        .eq("id", params.id)
        .single()

      if (error) throw error

      // Increment view count
      if (data) {
        await supabase
          .from("marketplace_listings")
          .update({ views: (data.views || 0) + 1 })
          .eq("id", params.id)
      }

      setListing(data)
    } catch (error: any) {
      console.error("Error loading listing:", error)
      toast.error("Failed to load listing")
    } finally {
      setLoading(false)
    }
  }

  const handleContactSeller = async () => {
    if (!listing) return

    setContacting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error("Please log in to contact the seller")
        router.push("/login")
        return
      }

      if (user.id === listing.user_id) {
        toast.error("You cannot contact yourself")
        return
      }

      // Get seller's email
      const sellerEmail = listing.profiles?.email

      if (sellerEmail) {
        // Create mailto link
        const subject = encodeURIComponent(`Inquiry about: ${listing.title}`)
        const body = encodeURIComponent(
          `Hello,\n\nI'm interested in purchasing "${listing.title}" from your Trove marketplace listing.\n\nPlease let me know if it's still available and how we can proceed with the transaction.\n\nThank you!`
        )
        window.location.href = `mailto:${sellerEmail}?subject=${subject}&body=${body}`
        toast.success("Opening email client...")
      } else {
        toast.error("Seller email not available")
      }
    } catch (error: any) {
      console.error("Error contacting seller:", error)
      toast.error("Failed to contact seller")
    } finally {
      setContacting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Listing not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Marketplace
      </Button>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          {listing.images && listing.images.length > 0 ? (
            <div className="relative h-96 w-full bg-muted rounded-lg overflow-hidden">
              <Image
                src={listing.images[0]}
                alt={listing.title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-96 w-full bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">No Image</p>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold">{listing.title}</h1>
              {listing.featured && (
                <Badge className="bg-primary">Featured</Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-muted-foreground text-sm mb-4">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {listing.views} views
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(listing.created_at).toLocaleDateString()}
              </div>
            </div>
            <div className="text-4xl font-bold mb-4">${listing.price}</div>
            <div className="flex gap-2 mb-4">
              <Badge variant="outline" className="capitalize">{listing.condition}</Badge>
              <Badge variant="outline" className="capitalize">{listing.category}</Badge>
            </div>
            {listing.location && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {listing.location}
              </div>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{listing.description || "No description provided."}</p>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleContactSeller}
              disabled={contacting}
            >
              <Mail className="w-4 h-4 mr-2" />
              {contacting ? "Opening..." : "Contact Seller"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              onClick={() => {
                // Future: Open in-app messaging
                toast.info("In-app messaging coming soon!")
              }}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Seller Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {listing.profiles?.avatar_url ? (
                    <Image
                      src={listing.profiles.avatar_url}
                      alt={listing.profiles.full_name || "Seller"}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="text-primary font-semibold">
                      {listing.profiles?.full_name?.[0]?.toUpperCase() || "S"}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-semibold">{listing.profiles?.full_name || "Anonymous Seller"}</p>
                  <p className="text-sm text-muted-foreground">Trove Member</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

