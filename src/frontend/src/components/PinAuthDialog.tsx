import { useState } from 'react';
import { Lock, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { toast } from 'sonner';

interface PinAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PinAuthDialog({ open, onOpenChange }: PinAuthDialogProps) {
  const [pin, setPin] = useState('');
  const { authenticate } = useAdminAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authenticate(pin)) {
      toast.success('Admin access granted');
      onOpenChange(false);
      setPin('');
    } else {
      toast.error('Incorrect PIN code');
      setPin('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Admin Access
          </DialogTitle>
          <DialogDescription>
            Enter the 4-digit PIN code to access admin features
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pin">PIN Code</Label>
            <Input
              id="pin"
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              autoFocus
              className="text-center text-2xl tracking-widest"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setPin('');
              }}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={pin.length !== 4}>
              <Lock className="h-4 w-4 mr-2" />
              Unlock
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
