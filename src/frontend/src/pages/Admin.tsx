import { useState } from 'react';
import { Loader2, Plus, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import ImageUpload, { type UploadState } from '../components/ImageUpload';
import { useGetAllSnackItems, useAddSnackItem, useGetAllBankAccounts } from '../hooks/useQueries';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

export default function Admin() {
  const { data: snackItems = [], isLoading } = useGetAllSnackItems();
  const { data: bankAccounts = [], isLoading: isBankAccountsLoading } = useGetAllBankAccounts();
  const addSnackItem = useAddSnackItem();

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
  });
  const [imageBlob, setImageBlob] = useState<ExternalBlob | null>(null);
  const [imageUploadState, setImageUploadState] = useState<UploadState>('idle');

  const handleImageSelect = (blob: ExternalBlob | null) => {
    setImageBlob(blob);
  };

  const handleUploadStateChange = (state: UploadState) => {
    setImageUploadState(state);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    if (!formData.id || !formData.name || !formData.description || !formData.price) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!imageBlob) {
      toast.error('Please upload an image');
      return;
    }

    // Check if image is still uploading
    if (imageUploadState === 'uploading') {
      toast.error('Please wait for the image to finish uploading');
      return;
    }

    // Check if image upload failed
    if (imageUploadState === 'error') {
      toast.error('Image upload failed. Please try uploading again');
      return;
    }

    const priceInCents = Math.round(parseFloat(formData.price) * 100);
    if (isNaN(priceInCents) || priceInCents <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      await addSnackItem.mutateAsync({
        id: formData.id,
        name: formData.name,
        description: formData.description,
        price: BigInt(priceInCents),
        image: imageBlob,
      });

      toast.success('Snack item added successfully!');
      
      // Reset form
      setFormData({ id: '', name: '', description: '', price: '' });
      setImageBlob(null);
      setImageUploadState('idle');
    } catch (error) {
      console.error('Error adding snack item:', error);
      toast.error(`Failed to add snack item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const bankAccount = bankAccounts.length > 0 ? bankAccounts[0] : null;

  // Determine if form can be submitted
  const canSubmit = 
    formData.id && 
    formData.name && 
    formData.description && 
    formData.price && 
    imageBlob && 
    imageUploadState === 'success' &&
    !addSnackItem.isPending;

  return (
    <div className="container px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">Manage your snack items and inventory</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Add New Item Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Snack Item
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="id">Item ID</Label>
                <Input
                  id="id"
                  placeholder="e.g., chips-001"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  required
                  disabled={addSnackItem.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Classic Potato Chips"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={addSnackItem.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your snack..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                  disabled={addSnackItem.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g., 2.99"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  disabled={addSnackItem.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label>Product Image</Label>
                <ImageUpload 
                  onImageSelect={handleImageSelect}
                  onUploadStateChange={handleUploadStateChange}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!canSubmit}
              >
                {addSnackItem.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Item...
                  </>
                ) : imageUploadState === 'uploading' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Preparing Image...
                  </>
                ) : (
                  'Add Snack Item'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Items List */}
        <Card>
          <CardHeader>
            <CardTitle>Current Menu Items ({snackItems.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : snackItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No items yet. Add your first snack!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {snackItems.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={item.image.getDirectURL()}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/assets/logo.dim_256x256.png';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                        <p className="text-sm font-bold text-primary mt-1">
                          ${(Number(item.price) / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    {index < snackItems.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bank Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Bank Account Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isBankAccountsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : bankAccount ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Account Holder Name</Label>
                <p className="text-foreground font-medium">{bankAccount.accountHolderName}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Bank Name</Label>
                <p className="text-foreground font-medium">{bankAccount.bankName}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Account Number</Label>
                <p className="text-foreground font-medium font-mono">{bankAccount.accountNumber}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Routing Number</Label>
                <p className="text-foreground font-medium font-mono">{bankAccount.routingNumber}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground mb-4">No bank account information saved yet.</p>
              <p className="text-sm text-muted-foreground">
                Visit the Bank Information page to add your account details.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
