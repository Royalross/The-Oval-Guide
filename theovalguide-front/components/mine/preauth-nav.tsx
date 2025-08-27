"use client";

import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

export default function PreauthNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="items-center gap-3">
        {/* Sign in */}
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className="hover:bg-accent hover:text-accent-foreground rounded-md border px-4 py-2 text-sm font-medium"
          >
            <Link href="/auth/sign-in">Sign in</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Sign up */}
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className="hover:bg-brand-darker rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-bold text-[var(--brand-contrast)]"
          >
            <Link href="/auth/sign-up">Sign up</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
