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
      <NavigationMenuList className="gap-3 items-center">
        {/* Sign in */}
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className="border rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            <Link href="/auth/sign-in">Sign in</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Sign up */}
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className="bg-[var(--brand)] text-[var(--brand-contrast)] rounded-md px-4 py-2 text-sm font-bold hover:bg-brand-darker"
          >
            <Link href="/auth/sign-up">Sign up</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
