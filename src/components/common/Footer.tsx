const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              About Us
            </h3>
            <p className="text-muted-foreground">
              Providing accurate house price predictions using advanced machine learning algorithms to help you make informed real estate decisions.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Quick Links
            </h3>
            <div className="text-muted-foreground space-y-2">
              <p>Home</p>
              <p>Price Prediction</p>
              <p>Market Trends</p>
              <p>Admin Panel</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Contact
            </h3>
            <div className="text-muted-foreground space-y-2">
              <p>Email: info@houseprice.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Available 24/7</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
          <p>{currentYear} House Price Prediction Platform</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
