import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Home } from 'lucide-react';
import { predictionApi } from '@/db/api';
import type { PredictionFormData } from '@/types/types';

const formSchema = z.object({
  city: z.string().min(1, 'City is required'),
  locality: z.string().min(1, 'Locality is required'),
  pincode: z.string().optional(),
  bhk: z.coerce.number().min(1, 'BHK must be at least 1').max(10, 'BHK cannot exceed 10'),
  total_area: z.coerce.number().min(100, 'Area must be at least 100 sqft').max(50000, 'Area cannot exceed 50000 sqft'),
  bathrooms: z.coerce.number().min(1, 'At least 1 bathroom required').max(10, 'Bathrooms cannot exceed 10'),
  floor_number: z.coerce.number().optional(),
  total_floors: z.coerce.number().optional(),
  property_age: z.coerce.number().min(0, 'Age cannot be negative').max(100, 'Age cannot exceed 100 years').optional(),
  furnishing_status: z.string().min(1, 'Furnishing status is required'),
  parking: z.boolean().default(false),
  facing_direction: z.string().optional(),
  has_lift: z.boolean().default(false),
  has_security: z.boolean().default(false),
  has_power_backup: z.boolean().default(false)
});

const PredictPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: '',
      locality: '',
      pincode: '',
      bhk: 2,
      total_area: 1000,
      bathrooms: 2,
      floor_number: undefined,
      total_floors: undefined,
      property_age: undefined,
      furnishing_status: '',
      parking: false,
      facing_direction: '',
      has_lift: false,
      has_security: false,
      has_power_backup: false
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const formData: PredictionFormData = {
        city: values.city,
        locality: values.locality,
        pincode: values.pincode,
        bhk: values.bhk,
        total_area: values.total_area,
        bathrooms: values.bathrooms,
        floor_number: values.floor_number,
        total_floors: values.total_floors,
        property_age: values.property_age,
        furnishing_status: values.furnishing_status,
        parking: values.parking || false,
        facing_direction: values.facing_direction,
        has_lift: values.has_lift || false,
        has_security: values.has_security || false,
        has_power_backup: values.has_power_backup || false
      };

      const prediction = await predictionApi.createPrediction(formData);
      
      if (prediction) {
        toast.success('Prediction created successfully!');
        navigate(`/results/${prediction.id}`);
      } else {
        toast.error('Failed to create prediction. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad'];
  const furnishingOptions = ['Unfurnished', 'Semi-Furnished', 'Fully-Furnished'];
  const facingDirections = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];

  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">Property Price Prediction</h1>
          <p className="text-lg text-muted-foreground">
            Enter your property details to get an instant price estimate
          </p>
        </div>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Home className="w-6 h-6 text-primary" />
              <span>Property Details</span>
            </CardTitle>
            <CardDescription>
              Fill in all the required information about your property
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
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
                    name="locality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Locality / Area *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Andheri West" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pincode</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 400053" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bhk"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>BHK *</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="total_area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Area (sqft) *</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 1000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bathrooms *</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="floor_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Floor Number</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="total_floors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Floors in Building</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="property_age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Age (years)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="furnishing_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Furnishing Status *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select furnishing" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {furnishingOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
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
                    name="facing_direction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facing Direction</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select direction" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {facingDirections.map((direction) => (
                              <SelectItem key={direction} value={direction}>
                                {direction}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <h3 className="text-lg font-semibold text-foreground">Amenities</h3>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="parking"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Parking Available</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="has_lift"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Lift Available</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="has_security"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">24/7 Security</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="has_power_backup"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Power Backup</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/')}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Get Prediction'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PredictPage;
