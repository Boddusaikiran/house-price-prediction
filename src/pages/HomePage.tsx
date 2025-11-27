import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BarChart3, FileText, Shield } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <TrendingUp className="w-12 h-12 text-primary" />,
      title: 'Instant Price Prediction',
      description: 'Get accurate house price estimates in seconds using advanced machine learning algorithms.',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop'
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-primary" />,
      title: 'Market Trends Analysis',
      description: 'Visualize historical market trends and make data-driven investment decisions.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop'
    },
    {
      icon: <FileText className="w-12 h-12 text-primary" />,
      title: 'Detailed PDF Reports',
      description: 'Download comprehensive reports with price analysis, comparables, and investment advice.',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop'
    },
    {
      icon: <Shield className="w-12 h-12 text-primary" />,
      title: 'Reliable & Accurate',
      description: 'Our predictions are based on extensive real estate data and proven ML models.',
      image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=400&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="relative gradient-primary py-20 xl:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl xl:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in">
              House Price Prediction Platform
            </h1>
            <p className="text-xl xl:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
              Get instant, accurate property valuations powered by machine learning. Make informed real estate decisions with confidence.
            </p>
            <div className="flex flex-col xl:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6 shadow-glow transition-smooth hover:scale-105"
                onClick={() => navigate('/predict')}
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Predict House Price
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 transition-smooth"
                onClick={() => navigate('/admin')}
              >
                <Shield className="w-5 h-5 mr-2" />
                Admin Panel
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 xl:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl xl:text-4xl font-bold text-foreground mb-4">
              Platform Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to make smart real estate investment decisions
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="shadow-elegant hover:shadow-glow transition-smooth hover:scale-105 overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                </div>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 xl:py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl xl:text-4xl font-bold text-foreground mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Enter your property details and receive an instant price prediction with detailed market analysis.
            </p>
            <Button
              size="lg"
              className="text-lg px-8 py-6 shadow-elegant transition-smooth hover:scale-105"
              onClick={() => navigate('/predict')}
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Start Prediction Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
