import { Link } from 'react-router-dom';
import { IdCard, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  return (
    <nav className="border-b bg-primary/5">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-primary hover:text-primary/90">
              <IdCard className="h-6 w-6" />
              <span className="font-semibold">ID Card System</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild className="text-primary hover:text-primary/90 hover:bg-primary/10">
                <Link to="/" className="flex items-center space-x-2">
                  <IdCard className="h-4 w-4" />
                  <span>Customize Product</span>
                </Link>
              </Button>
              <Button variant="ghost" asChild className="text-primary hover:text-primary/90 hover:bg-primary/10">
                <Link to="/personal-info" className="flex items-center space-x-2">
                  <UserRound className="h-4 w-4" />
                  <span>Personal Information</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}