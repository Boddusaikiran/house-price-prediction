import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Download, TrendingUp, Home, ArrowLeft, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { predictionApi, comparablesApi, marketTrendsApi } from '@/db/api';
import { supabase } from '@/db/supabase';
import type { Prediction, Comparable, MarketTrend } from '@/types/types';

const ResultsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [comparables, setComparables] = useState<Comparable[]>([]);
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (id) {
      loadPredictionData();
    }
  }, [id]);

  const loadPredictionData = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const predictionData = await predictionApi.getPredictionById(id);
      
      if (!predictionData) {
        toast.error('Prediction not found');
        navigate('/predict');
        return;
      }

      setPrediction(predictionData);

      if (!predictionData.predicted_avg_price) {
        await calculatePrediction(predictionData);
      }

      const comparablesData = await comparablesApi.getSimilarComparables(
        predictionData.city,
        predictionData.bhk,
        5
      );
      setComparables(comparablesData);

      const trendsData = await marketTrendsApi.getMarketTrends(
        predictionData.city,
        predictionData.locality
      );
      setMarketTrends(trendsData);
    } catch (error) {
      console.error('Error loading prediction data:', error);
      toast.error('Failed to load prediction data');
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePrediction = async (predictionData: Prediction) => {
    setIsCalculating(true);
    try {
      const { data, error } = await supabase.functions.invoke('predict-price', {
        body: {
          city: predictionData.city,
          locality: predictionData.locality,
          bhk: predictionData.bhk,
          total_area: predictionData.total_area,
          bathrooms: predictionData.bathrooms,
          floor_number: predictionData.floor_number,
          total_floors: predictionData.total_floors,
          property_age: predictionData.property_age,
          furnishing_status: predictionData.furnishing_status,
          parking: predictionData.parking,
          facing_direction: predictionData.facing_direction,
          has_lift: predictionData.has_lift,
          has_security: predictionData.has_security,
          has_power_backup: predictionData.has_power_backup
        }
      });

      if (error) {
        const errorMsg = await error?.context?.text();
        console.error('Edge function error in predict-price:', errorMsg);
        toast.error('Failed to calculate prediction');
        return;
      }

      if (data?.success && data?.data) {
        const updatedPrediction = await predictionApi.updatePrediction(predictionData.id, {
          predicted_min_price: data.data.predicted_min_price,
          predicted_avg_price: data.data.predicted_avg_price,
          predicted_max_price: data.data.predicted_max_price,
          predicted_fair_value: data.data.predicted_fair_value,
          price_per_sqft: data.data.price_per_sqft,
          confidence_score: data.data.confidence_score
        });

        if (updatedPrediction) {
          setPrediction(updatedPrediction);
          toast.success('Prediction calculated successfully!');
        }
      }
    } catch (error) {
      console.error('Error calculating prediction:', error);
      toast.error('Failed to calculate prediction');
    } finally {
      setIsCalculating(false);
    }
  };

  const formatCurrency = (value: number | undefined) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number | undefined) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const downloadPDF = () => {
    toast.info('PDF generation feature coming soon!');
  };

  const chartData = marketTrends.map(trend => ({
    name: `${trend.month.substring(0, 3)} ${trend.year}`,
    price: trend.avg_price / 10000000,
    pricePerSqft: trend.avg_price_per_sqft
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-12 w-64 mb-8 bg-muted" />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Skeleton className="h-64 bg-muted" />
            <Skeleton className="h-64 bg-muted" />
            <Skeleton className="h-96 bg-muted" />
            <Skeleton className="h-96 bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="min-h-screen py-12 bg-muted/30 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Prediction Not Found</CardTitle>
            <CardDescription>The requested prediction could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/predict')}>
              Create New Prediction
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Price Prediction Results</h1>
            <p className="text-muted-foreground">
              {prediction.bhk} BHK in {prediction.locality}, {prediction.city}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/predict')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              New Prediction
            </Button>
            <Button onClick={downloadPDF}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {isCalculating && (
          <Card className="mb-6 border-primary">
            <CardContent className="py-4">
              <p className="text-center text-muted-foreground">
                Calculating prediction using ML model...
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-elegant hover:shadow-glow transition-smooth">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Minimum Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(prediction.predicted_min_price)}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant hover:shadow-glow transition-smooth">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(prediction.predicted_avg_price)}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant hover:shadow-glow transition-smooth">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Maximum Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(prediction.predicted_max_price)}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant hover:shadow-glow transition-smooth gradient-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-primary-foreground">
                Fair Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-foreground">
                {formatCurrency(prediction.predicted_fair_value)}
              </div>
              <p className="text-xs text-primary-foreground/80 mt-1">
                Confidence: {prediction.confidence_score}%
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="w-5 h-5 text-primary" />
                <span>Property Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{prediction.locality}, {prediction.city}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">BHK</p>
                  <p className="font-medium">{prediction.bhk} BHK</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Area</p>
                  <p className="font-medium">{formatNumber(prediction.total_area)} sqft</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price per sqft</p>
                  <p className="font-medium">{formatCurrency(prediction.price_per_sqft)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bathrooms</p>
                  <p className="font-medium">{prediction.bathrooms}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Furnishing</p>
                  <p className="font-medium">{prediction.furnishing_status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Property Age</p>
                  <p className="font-medium">{prediction.property_age || 'N/A'} years</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amenities</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {prediction.parking && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Parking</span>}
                    {prediction.has_lift && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Lift</span>}
                    {prediction.has_security && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Security</span>}
                    {prediction.has_power_backup && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Power Backup</span>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Price Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Price Range</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(prediction.predicted_min_price)} - {formatCurrency(prediction.predicted_max_price)}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full gradient-primary" style={{ width: '100%' }} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Investment Recommendation</p>
                  <p className="text-sm">
                    Based on current market trends and property features, this property is valued at{' '}
                    <span className="font-semibold text-primary">
                      {formatCurrency(prediction.predicted_fair_value)}
                    </span>
                    . The confidence score of {prediction.confidence_score}% indicates a reliable prediction.
                  </p>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Market Position</p>
                  <p className="text-sm">
                    The price per sqft of {formatCurrency(prediction.price_per_sqft)} is competitive for the {prediction.locality} area in {prediction.city}.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {comparables.length > 0 && (
          <Card className="shadow-elegant mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="w-5 h-5 text-primary" />
                <span>Comparable Properties</span>
              </CardTitle>
              <CardDescription>
                Similar properties in {prediction.city}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Location</TableHead>
                      <TableHead>BHK</TableHead>
                      <TableHead>Area (sqft)</TableHead>
                      <TableHead>Furnishing</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Price/sqft</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comparables.map((comp) => (
                      <TableRow key={comp.id}>
                        <TableCell className="font-medium">{comp.locality}</TableCell>
                        <TableCell>{comp.bhk} BHK</TableCell>
                        <TableCell>{formatNumber(comp.total_area)}</TableCell>
                        <TableCell>{comp.furnishing_status}</TableCell>
                        <TableCell>{formatCurrency(comp.price)}</TableCell>
                        <TableCell>{formatCurrency(comp.price_per_sqft)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {chartData.length > 0 && (
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span>Market Trends</span>
              </CardTitle>
              <CardDescription>
                Historical price trends for {prediction.city}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '12px' }}
                      label={{ value: 'Price (Cr)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Avg Price (Cr)"
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="pricePerSqft" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={2}
                      name="Price per sqft"
                      dot={{ fill: 'hsl(var(--accent))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
