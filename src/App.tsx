import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ProductCustomization from '@/pages/ProductCustomization';
import ThankYou from "@/pages/ThankYou";
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<ProductCustomization />} />
            <Route path="/thankyou" element={<ThankYou />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;