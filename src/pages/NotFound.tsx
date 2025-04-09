
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-6">
          <div className="h-24 w-24 rounded-xl bg-gradient-to-br from-skillsync-blue to-skillsync-purple flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-6xl">404</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            We couldn't find the page you were looking for. It might have been removed, renamed, or doesn't exist.
          </p>
          <Button className="bg-skillsync-blue hover:bg-skillsync-blue/90" asChild>
            <Link to="/" className="flex items-center gap-2">
              <Home size={16} />
              Return to Home
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
