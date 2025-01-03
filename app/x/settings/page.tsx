'use client'

import { useEffect, useState } from "react"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/context/auth-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Organization = {
  id: string;
  name: string;
}

type JTMembership = {
  organization: {
    id: string;
    name: string;
  };
};

export default function SettingsPage() {
  const { user } = useAuth()
  const userId = user?.uid || ''

  const [settings, setSettings] = useState({
    jtgrantkey: '',
    jtorgid: '',
    enableNotifications: false,
    enableAutoSync: false,
    enableDarkMode: false,
  })
  const [unsavedChanges, setUnsavedChanges] = useState(false)

  const [showGrantKey, setShowGrantKey] = useState(false)

  // Add state for organizations
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(false)

  // Fetch user settings from Firestore
  useEffect(() => {
    const fetchSettings = async () => {
      if (!userId) return

      // First get the user document
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (!userDoc.exists()) return

      const userData = userDoc.data()
      
      // Get the organization document
      const orgDoc = await getDoc(doc(db, 'orgs', userData.org))
      if (!orgDoc.exists()) return

      const orgData = orgDoc.data()
      
      setSettings(prev => ({
        ...prev,
        jtgrantkey: orgData.grantKey || '',
        jtorgid: orgData.orgID || '',
        // Keep other settings as is
      }))

    }

    fetchSettings()
  }, [userId])

  // Modify input handler to only update local state
  const handleInputChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSettings(prev => ({ ...prev, [key]: newValue }))
    setUnsavedChanges(true)
  }

  // Modify toggle handler to only update local state
  const handleToggleChange = (key: string) => (checked: boolean) => {
    setSettings(prev => ({ ...prev, [key]: checked }))
    setUnsavedChanges(true)
  }

  // New save handler
  const handleSave = async () => {
    if (!userId) {
      alert('User not authenticated')
      return
    }

    try {
      // Get user's org ID first
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (!userDoc.exists()) return
      
      // Update org document with API keys
      await updateDoc(doc(db, 'orgs', userDoc.data().org), {
        grantKey: settings.jtgrantkey,
        orgID: settings.jtorgid
      })

      // Update user document with toggle settings
      await updateDoc(doc(db, 'users', userId), {
        enableNotifications: settings.enableNotifications,
        enableAutoSync: settings.enableAutoSync,
        enableDarkMode: settings.enableDarkMode
      })

      setUnsavedChanges(false)
      alert('Settings saved successfully')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
    }
  }

  // Modify orgLookUp to parse and set organizations
  const orgLookUp = async (grantKey: string) => {
    if (!grantKey) {
      console.error('Missing grantKey')
      return null
    }

    setIsLoadingOrgs(true)
    try {
      const response = await fetch('/api/jtfetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: {
            "$": { "grantKey": grantKey },
            "currentGrant": {
              "user": {
                "memberships": {
                  "nodes": {
                    "organization": {
                      "id": {},
                      "name": {}
                    }
                  }
                }
              }
            }
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const orgs = data?.currentGrant?.user?.memberships?.nodes?.map(
        (node: JTMembership | undefined) => ({
          id: node?.organization?.id || '',
          name: node?.organization?.name || ''
        })
      ) || []
      
      setOrganizations(orgs)
      return data
    } catch (error) {
      console.error('Error fetching query:', error)
      return null
    } finally {
      setIsLoadingOrgs(false)
    }
  }

  // Add this effect to fetch organizations when grant key changes
  useEffect(() => {
    if (settings.jtgrantkey) {
      orgLookUp(settings.jtgrantkey)
    }
  }, [settings.jtgrantkey])

  return (
    <main className="flex flex-col flex-1 p-0">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-col gap-8 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <Button 
            onClick={handleSave}
            disabled={!unsavedChanges}
          >
            Save Changes
          </Button>
        </div>

        <div className="grid gap-6 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Configure your JobTread API credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jobtread-api">JobTread API Grant Key</Label>
                <div className="relative">
                  <Input
                    id="jobtread-api"
                    type={showGrantKey ? "text" : "password"}
                    value={settings.jtgrantkey}
                    onChange={handleInputChange('jtgrantkey')}
                    placeholder="Enter your JobTread API Grant Key"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGrantKey(!showGrantKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showGrantKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobtread-org">JobTread Organization</Label>
                <Select
                  value={settings.jtorgid}
                  onValueChange={(value) => {
                    setSettings(prev => ({ ...prev, jtorgid: value }))
                    setUnsavedChanges(true)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingOrgs ? (
                      <SelectItem value="loading" disabled>
                        Loading organizations...
                      </SelectItem>
                    ) : organizations.length > 0 ? (
                      organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No organizations found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications</Label>
                  <div className="text-sm text-muted-foreground">
                    Receive notifications about updates and alerts
                  </div>
                </div>
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={handleToggleChange('enableNotifications')}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Sync</Label>
                  <div className="text-sm text-muted-foreground">
                    Automatically sync data with external services
                  </div>
                </div>
                <Switch
                  checked={settings.enableAutoSync}
                  onCheckedChange={handleToggleChange('enableAutoSync')}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <div className="text-sm text-muted-foreground">
                    Enable dark mode for the interface
                  </div>
                </div>
                <Switch
                  checked={settings.enableDarkMode}
                  onCheckedChange={handleToggleChange('enableDarkMode')}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
