import { useState, useEffect } from 'react';
import { Loader2, Building2, CreditCard, User, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetAllBankAccounts, useAddBankAccount } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function BankInformation() {
  const { data: bankAccounts = [], isLoading } = useGetAllBankAccounts();
  const addBankAccount = useAddBankAccount();

  const [formData, setFormData] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
  });

  // Load existing bank account data into form
  useEffect(() => {
    if (bankAccounts.length > 0) {
      const account = bankAccounts[0];
      setFormData({
        accountHolderName: account.accountHolderName,
        bankName: account.bankName,
        accountNumber: account.accountNumber,
        routingNumber: account.routingNumber,
      });
    }
  }, [bankAccounts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.accountHolderName || !formData.bankName || !formData.accountNumber || !formData.routingNumber) {
      toast.error('Please fill in all fields');
      return;
    }

    addBankAccount.mutate(
      {
        accountHolderName: formData.accountHolderName,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        routingNumber: formData.routingNumber,
      },
      {
        onSuccess: () => {
          toast.success('Bank information saved successfully!');
        },
        onError: (error) => {
          toast.error(`Failed to save bank information: ${error.message}`);
        },
      }
    );
  };

  return (
    <div className="container px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Bank Information</h1>
        </div>
        <p className="text-muted-foreground">
          Manage your bank account details for receiving customer payments
        </p>
      </div>

      <Alert className="mb-6 border-primary/20 bg-primary/5">
        <CreditCard className="h-4 w-4" />
        <AlertDescription>
          This information will be used to receive funds when customers place orders. 
          Keep your bank details up to date to ensure smooth payment processing.
        </AlertDescription>
      </Alert>

      <Card className="border-2 border-border/50">
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>
            {bankAccounts.length > 0 
              ? 'Update your existing bank account information' 
              : 'Enter your bank account information to start receiving payments'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-10 bg-muted animate-pulse rounded" />
              <div className="h-10 bg-muted animate-pulse rounded" />
              <div className="h-10 bg-muted animate-pulse rounded" />
              <div className="h-10 bg-muted animate-pulse rounded" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="accountHolderName" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Account Holder Name
                </Label>
                <Input
                  id="accountHolderName"
                  placeholder="John Doe"
                  value={formData.accountHolderName}
                  onChange={(e) =>
                    setFormData({ ...formData, accountHolderName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankName" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  Bank Name
                </Label>
                <Input
                  id="bankName"
                  placeholder="First National Bank"
                  value={formData.bankName}
                  onChange={(e) =>
                    setFormData({ ...formData, bankName: e.target.value })
                  }
                  required
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="accountNumber" className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  Account Number
                </Label>
                <Input
                  id="accountNumber"
                  placeholder="1234567890"
                  value={formData.accountNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, accountNumber: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="routingNumber" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  Routing Number
                </Label>
                <Input
                  id="routingNumber"
                  placeholder="123456789"
                  value={formData.routingNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, routingNumber: e.target.value })
                  }
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={addBankAccount.isPending}
              >
                {addBankAccount.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    {bankAccounts.length > 0 ? 'Update Bank Information' : 'Save Bank Information'}
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
