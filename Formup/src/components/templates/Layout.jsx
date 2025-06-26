import { Outlet, Link } from 'react-router-dom';
import { Slack, FileText } from 'lucide-react';

import Button from '../atoms/Button';

const Layout = () => {
  

  return (
    <div className="min-h-screen bg-gray-50 ">
      <header className="bg-white  shadow-sm border-b border-gray-200 ">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Slack className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900 ">
                FormUp
              </span>
            </Link>
            
           
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;