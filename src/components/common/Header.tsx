import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, TrendingUp, Shield, Menu, X, Building2 } from "lucide-react";
import routes from "../../routes";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigation = routes.filter((route) => route.visible !== false);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Home':
        return <Home className="w-4 h-4" />;
      case 'Predict':
        return <TrendingUp className="w-4 h-4" />;
      case 'Admin':
        return <Shield className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-elegant">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">
                House Price Prediction
              </span>
            </Link>
          </div>

          <div className="hidden xl:flex items-center space-x-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="transition-smooth"
                  >
                    {getIcon(item.name)}
                    <span className="ml-2">{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          <div className="xl:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="xl:hidden pb-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block"
                >
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start transition-smooth"
                  >
                    {getIcon(item.name)}
                    <span className="ml-2">{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
