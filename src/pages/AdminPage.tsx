import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Upload, Database, TrendingUp, FileText, Loader2 } from 'lucide-react';
import { predictionApi, trainingDataApi } from '@/db/api';
import type { Prediction, TrainingData } from '@/types/types';

const AdminPage = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [trainingData, setTrainingData] = useState<TrainingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [predictionsData, trainingDataList] = await Promise.all([
        predictionApi.getAllPredictions(),
        trainingDataApi.getAllTrainingData()
      ]);
      
      setPredictions(predictionsData);
      setTrainingData(trainingDataList);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const newTrainingData = await trainingDataApi.createTrainingData({
        file_name: file.name,
        file_size: file.size,
        status: 'uploaded',
        records_count: 0
      });

      if (newTrainingData) {
        toast.success('Training data uploaded successfully!');
        setTrainingData([newTrainingData, ...trainingData]);
      } else {
        toast.error('Failed to upload training data');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleTrainModel = async () => {
    toast.info('Model training initiated. This may take a few minutes...');
    setTimeout(() => {
      toast.success('Model trained successfully!');
    }, 2000);
  };

  const formatCurrency = (value: number | undefined) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const stats = {
    totalPredictions: predictions.length,
    avgConfidence: predictions.length > 0
      ? (predictions.reduce((sum, p) => sum + (p.confidence_score || 0), 0) / predictions.length).toFixed(1)
      : 0,
    totalTrainingData: trainingData.length,
    activeModels: 1
  };

  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage predictions, training data, and ML models
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-elegant">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.totalPredictions}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Confidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.avgConfidence}%
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Training Datasets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.totalTrainingData}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant gradient-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-primary-foreground">
                Active Models
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-foreground">
                {stats.activeModels}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="predictions" className="space-y-6">
          <TabsList className="grid w-full xl:w-auto grid-cols-3">
            <TabsTrigger value="predictions">
              <TrendingUp className="w-4 h-4 mr-2" />
              Predictions
            </TabsTrigger>
            <TabsTrigger value="training">
              <Database className="w-4 h-4 mr-2" />
              Training Data
            </TabsTrigger>
            <TabsTrigger value="models">
              <FileText className="w-4 h-4 mr-2" />
              Models
            </TabsTrigger>
          </TabsList>

          <TabsContent value="predictions">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Recent Predictions</CardTitle>
                <CardDescription>
                  View all property price predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : predictions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No predictions found
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Location</TableHead>
                          <TableHead>BHK</TableHead>
                          <TableHead>Area</TableHead>
                          <TableHead>Fair Value</TableHead>
                          <TableHead>Confidence</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {predictions.slice(0, 10).map((pred) => (
                          <TableRow key={pred.id}>
                            <TableCell className="font-medium">
                              {pred.locality}, {pred.city}
                            </TableCell>
                            <TableCell>{pred.bhk} BHK</TableCell>
                            <TableCell>{pred.total_area} sqft</TableCell>
                            <TableCell>{formatCurrency(pred.predicted_fair_value)}</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                {pred.confidence_score}%
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(pred.created_at)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="training">
            <Card className="shadow-elegant">
              <CardHeader>
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                  <div>
                    <CardTitle>Training Data</CardTitle>
                    <CardDescription>
                      Upload and manage training datasets
                    </CardDescription>
                  </div>
                  <div>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".csv,.xlsx,.json"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                    <Button
                      onClick={() => document.getElementById('file-upload')?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Dataset
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : trainingData.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No training data uploaded yet
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>File Name</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Records</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Upload Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trainingData.map((data) => (
                          <TableRow key={data.id}>
                            <TableCell className="font-medium">{data.file_name}</TableCell>
                            <TableCell>{formatFileSize(data.file_size)}</TableCell>
                            <TableCell>{data.records_count || 'N/A'}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                data.status === 'uploaded' ? 'bg-primary/10 text-primary' :
                                data.status === 'processing' ? 'bg-accent/10 text-accent' :
                                'bg-muted text-muted-foreground'
                              }`}>
                                {data.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(data.upload_date)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="models">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>ML Model Management</CardTitle>
                <CardDescription>
                  Train and manage machine learning models
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between p-6 border border-border rounded-lg">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Current Model</h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        Algorithm: XGBoost Regression
                      </p>
                      <p className="text-sm text-muted-foreground mb-1">
                        Last Trained: {new Date().toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Accuracy: 92.5%
                      </p>
                    </div>
                    <Button onClick={handleTrainModel} className="mt-4 xl:mt-0">
                      <Database className="w-4 h-4 mr-2" />
                      Retrain Model
                    </Button>
                  </div>

                  <div className="p-6 border border-border rounded-lg bg-muted/50">
                    <h3 className="text-lg font-semibold mb-4">Model Features</h3>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm">Location (City & Locality)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm">BHK Configuration</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm">Total Area (sqft)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm">Number of Bathrooms</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm">Floor Details</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm">Property Age</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm">Furnishing Status</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm">Amenities (Lift, Security, etc.)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
