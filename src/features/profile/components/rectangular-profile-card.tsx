import { Button } from "@/components/ui/button";
import { authClient } from "@/features/auth/lib/better-auth-client";
import { signOut } from "@/features/auth/lib/sign-out";
import { useEffect, useState } from "react";
import { CustomerState } from "@polar-sh/sdk/models/components/customerstate";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, LogOut } from "lucide-react";

export function RectangularProfileCard() {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const { data: session } = authClient.useSession();

  const [customerState, setCustomerState] = useState<CustomerState | null>(
    null,
  );

  useEffect(() => {
    async function getCustomerState() {
      if (!session) return;

      const { data: state } = await authClient.customer.state();
      //@ts-ignore
      setCustomerState(state);
    }

    getCustomerState();
  }, [session]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
  };

  return (
    <div className="flex items-center gap-2 w-full p-2 bg-muted/50">
      <Avatar size="lg">
        <AvatarImage
          src={customerState?.avatarUrl}
          alt={customerState?.name ?? session?.user.name}
        />
        <AvatarFallback>{session?.user.name.slice(0, 1)}</AvatarFallback>
      </Avatar>

      <div>
        <p className="font-medium">
          {customerState?.name ?? session?.user.name}
        </p>
        <p className="text-muted-foreground">{customerState?.email}</p>
      </div>

      <Button
        variant="ghost"
        onClick={handleSignOut}
        className="ml-auto cursor-pointer"
        disabled={isSigningOut}
      >
        {isSigningOut && <Loader2 className="size-4 animate-spin" />}
        {!isSigningOut && <LogOut className="size-4" />}
      </Button>
    </div>
  );
}
