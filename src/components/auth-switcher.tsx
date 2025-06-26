"use client"

import { useAuth, type UserRole } from "@/context/auth-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserCog } from "lucide-react"

export function AuthSwitcher({ dictionary }: { dictionary: any }) {
  const { loginAs, user } = useAuth();

  const handleLogin = (role: UserRole) => {
    loginAs(role);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <UserCog className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{dictionary.auth} <span className="font-normal text-muted-foreground">({user?.name})</span></DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.keys(dictionary.roles) as UserRole[]).map(role => (
          <DropdownMenuItem
            key={role}
            onClick={() => handleLogin(role)}
            disabled={user?.role === role}
          >
            {dictionary.roles[role]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
