import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Heart className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center text-xl">Authentication Required</DialogTitle>
          <DialogDescription className="text-center">
            Please sign in or create an account to access your playlists.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-center sm:space-x-2">
          <Button
            variant="default"
            onClick={() => {
              onClose();
              router.push("/login");
            }}
            className="w-full sm:w-auto"
          >
            Sign In
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              router.push("/signup");
            }}
            className="w-full sm:w-auto"
          >
            Create Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 