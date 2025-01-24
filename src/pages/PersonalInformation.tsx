import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { Image } from 'lucide-react';

const MAX_PROFILE_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_SIGNATURE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const formSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  fatherName: z.string().min(2, "Father's name must be at least 2 characters"),
  designation: z.string().min(2, 'Designation must be at least 2 characters'),
  organizationName: z.string().min(2, 'Organization name is required'),
  centerName: z.string().optional(),
  bloodGroup: z.string().refine((val) => bloodGroups.includes(val), {
    message: 'Please select a valid blood group',
  }),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  contactNumber: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number'),
  emergencyContact: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number'),
});

type FormValues = z.infer<typeof formSchema>;

export default function PersonalInformation() {
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      fatherName: '',
      designation: '',
      organizationName: '',
      centerName: '',
      bloodGroup: '',
      address: '',
      contactNumber: '',
      emergencyContact: '',
    },
  });

  const validateImage = (
    file: File,
    maxSize: number,
    maxWidth?: number,
    maxHeight?: number
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error('Invalid file type. Please upload a JPG or PNG file.');
        resolve(false);
        return;
      }
  
      if (file.size > maxSize) {
        toast.error(`File size exceeds ${maxSize / 1024 / 1024}MB limit.`);
        resolve(false);
        return;
      }
  
      const img = new window.Image(); // Use window.Image to ensure it's the DOM Image constructor
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (maxWidth && maxHeight) {
          if (img.width > maxWidth || img.height > maxHeight) {
            toast.error(`Image dimensions should not exceed ${maxWidth}x${maxHeight}px`);
            resolve(false);
            return;
          }
        }
        resolve(true);
      };
      img.onerror = () => {
        toast.error('Failed to load image');
        resolve(false);
      };
    });
  };

  const handleImageUpload = async (
    file: File,
    bucket: string,
    type: 'profile' | 'signature'
  ): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${type}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleProfileImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isValid = await validateImage(file, MAX_PROFILE_IMAGE_SIZE);
    if (!isValid) return;

    const preview = URL.createObjectURL(file);
    setProfilePreview(preview);
  };

  const handleSignatureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isValid = await validateImage(file, MAX_SIGNATURE_SIZE, 300, 150);
    if (!isValid) return;

    const preview = URL.createObjectURL(file);
    setSignaturePreview(preview);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsUploading(true);

      const profileInput = document.querySelector<HTMLInputElement>('#profile-image');
      const signatureInput = document.querySelector<HTMLInputElement>('#signature-image');
      
      let profileImageUrl = '';
      let signatureImageUrl = '';

      if (profileInput?.files?.[0]) {
        profileImageUrl = await handleImageUpload(
          profileInput.files[0],
          'profile_images',
          'profile'
        );
      }

      if (signatureInput?.files?.[0]) {
        signatureImageUrl = await handleImageUpload(
          signatureInput.files[0],
          'signature_images',
          'signature'
        );
      }

      const { error } = await supabase.from('personal_information').insert([{
        ...data,
        profile_image_url: profileImageUrl,
        signature_image_url: signatureImageUrl,
      }]);

      if (error) throw error;

      toast.success('Personal information saved successfully!');
      form.reset();
      setProfilePreview(null);
      setSignaturePreview(null);
    } catch (error) {
      console.error('Error saving personal information:', error);
      toast.error('Failed to save personal information');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="border-t-4 border-t-primary shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-primary">Personal Information</CardTitle>
          <CardDescription>
            Please fill in your personal details for the ID card. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="organizationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Organization Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Organization name" className="border-primary/20 focus:border-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="centerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Center Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Center name" className="border-primary/20 focus:border-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" className="border-primary/20 focus:border-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fatherName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Father's Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="James Doe" className="border-primary/20 focus:border-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Designation *</FormLabel>
                      <FormControl>
                        <Input placeholder="Software Engineer" className="border-primary/20 focus:border-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bloodGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Blood Group *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-primary/20 focus:border-primary">
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bloodGroups.map((group) => (
                            <SelectItem key={group} value={group}>
                              {group}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Contact Number *</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+1234567890" className="border-primary/20 focus:border-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Emergency Contact *</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+1234567890" className="border-primary/20 focus:border-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">Address *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your complete address"
                        className="min-h-[100px] border-primary/20 focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormLabel className="text-primary">Profile Image *</FormLabel>
                  <div className="border-2 border-dashed border-primary/20 rounded-lg p-4">
                    <input
                      type="file"
                      id="profile-image"
                      accept=".jpg,.jpeg,.png"
                      className="hidden"
                      onChange={handleProfileImageChange}
                    />
                    <label
                      htmlFor="profile-image"
                      className="cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                      {profilePreview ? (
                        <img
                          src={profilePreview}
                          alt="Profile preview"
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <>
                          <Image className="w-12 h-12 text-primary/60" />
                          <span className="text-sm text-muted-foreground">
                            Click to upload profile image (Max: 2MB)
                          </span>
                        </>
                      )}
                    </label>
                    <FormDescription>
                      Accepted formats: JPG, PNG. Aspect ratio: 1:1
                    </FormDescription>
                  </div>
                </div>

                <div className="space-y-4">
                  <FormLabel className="text-primary">Signature *</FormLabel>
                  <div className="border-2 border-dashed border-primary/20 rounded-lg p-4">
                    <input
                      type="file"
                      id="signature-image"
                      accept=".jpg,.jpeg,.png"
                      className="hidden"
                      onChange={handleSignatureChange}
                    />
                    <label
                      htmlFor="signature-image"
                      className="cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                      {signaturePreview ? (
                        <img
                          src={signaturePreview}
                          alt="Signature preview"
                          className="max-w-full max-h-[150px] object-contain rounded-lg"
                        />
                      ) : (
                        <>
                          <Image className="w-12 h-12 text-primary/60" />
                          <span className="text-sm text-muted-foreground">
                            Click to upload signature (Max: 1MB)
                          </span>
                        </>
                      )}
                    </label>
                    <FormDescription>
                      Accepted formats: JPG, PNG. Max dimensions: 300x150px
                    </FormDescription>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isUploading}
              >
                {isUploading ? 'Saving...' : 'Save Information'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}