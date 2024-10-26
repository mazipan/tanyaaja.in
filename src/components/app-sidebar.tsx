import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { destroyActiveSession } from '@/lib/api'
import { getFirebaseAuth } from '@/lib/firebase'
import { DEFAULT_AVATAR } from '@/lib/utils'
import { useOwner } from '@/queries/useQueries'
import { signOut } from 'firebase/auth'
import {
  Bell,
  ChevronsUpDown,
  Image,
  ListCheck,
  ListTodo,
  LogOut,
  Monitor,
  UserRoundCog,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from './FirebaseAuth'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { useToast } from './ui/use-toast'

// Menu items.
const items = [
  {
    title: 'Dashboard',
    url: '/account',
    icon: Monitor,
  },
  {
    title: 'Belum Terjawab',
    url: '/account/questions/pending',
    icon: ListTodo,
  },
  {
    title: 'Selesai Dijawab',
    url: '/account/questions/done',
    icon: ListCheck,
  },
  {
    title: 'Pengaturan Akun',
    url: '/account/settings',
    icon: UserRoundCog,
  },
  {
    title: 'Pengaturan OG',
    url: '/account/settings/og-image',
    icon: Image,
  },
  {
    title: 'Pengaturan Notifikasi',
    url: '/account/settings/notification',
    icon: Bell,
  },
]

const auth = getFirebaseAuth()

export function AppSidebar() {
  const router = useRouter()
  const { toast } = useToast()
  const { isLogin, user, isLoading } = useAuth(auth)
  const { data: dataOwner, isLoading: isLoadingOwner } = useOwner(user!, {
    enabled: !isLoading && isLogin && !!user,
  })

  const handleLogout = async () => {
    if (user) {
      try {
        await destroyActiveSession(user)
      } catch {}
    }

    signOut(auth)
      .then(() => {
        toast({
          description: `Berhasil logout!`,
        })

        setTimeout(() => {
          router.push('/login')
        }, 500)
      })
      .catch((error) => {
        toast({
          title: 'Gagal logout',
          description: `${error.message}`,
          variant: 'destructive',
        })
      })
  }

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="lg">
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg">
                <Avatar className="cursor-pointer border h-8 w-8">
                  {!isLoadingOwner && dataOwner && dataOwner.data && (
                    <>
                      <AvatarImage
                        src={
                          dataOwner?.data?.image ||
                          user?.photoURL ||
                          DEFAULT_AVATAR
                        }
                        alt={user?.displayName || ''}
                        className="bg-white"
                      />

                      <AvatarFallback>
                        {user?.displayName
                          ?.split(' ')
                          .map((n: string) => n[0])
                          .join('')
                          .substring(2, 0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
                {user?.displayName}
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="w-[--radix-popper-anchor-width]"
            >
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user?.displayName}</span>
                  <span className="font-light text-sm text-secondary-foreground">
                    {user?.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer py-3"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
