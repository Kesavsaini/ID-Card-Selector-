import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ProductCustomization from '@/pages/ProductCustomization';
import PersonalInformation from '@/pages/PersonalInformation';
import Navigation from '@/components/Navigation';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        {/* <Navigation /> */}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<ProductCustomization />} />
            <Route path="/personal-info" element={<PersonalInformation />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;