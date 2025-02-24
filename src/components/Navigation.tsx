
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const handleAuth = () => {
    if (session) {
      supabase.auth.signOut();
    } else {
      navigate("/auth");
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full backdrop-blur-lg bg-white/90 border-b border-gray-200/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold text-primary">CodeAcademy</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#courses" className="nav-link">Courses</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            {!loading && (
              <Button
                variant="default"
                className="ml-4 bg-primary hover:bg-primary/90"
                onClick={handleAuth}
              >
                {session ? "Sign Out" : "Sign In"}
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 text-primary"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden animate-fadeIn">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#courses"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary"
              >
                Courses
              </a>
              <a
                href="#features"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary"
              >
                Pricing
              </a>
              {!loading && (
                <Button
                  className="w-full mt-4 bg-primary hover:bg-primary/90"
                  onClick={handleAuth}
                >
                  {session ? "Sign Out" : "Sign In"}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
