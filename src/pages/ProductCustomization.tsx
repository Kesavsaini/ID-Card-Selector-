import { useState } from 'react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Metal_Frame from "@/public/Metal_Frame.png"
import Metal_Frame_2 from "@/public/Metal_Frame_2.png"
import Metal_Frame_3 from "@/public/Metal_Frame_3.png"
import lanyard_1 from "@/public/lanyard_1.png"
import lanyard_2 from "@/public/lanyard_2.png"
import id_card_1 from "@/public/id_card_1.png"
import id_card_2 from "@/public/id_card_2.png"

const products = [
  {
    id: 1,
    title: 'ID Holder',
    description: 'Choose color and quantity',
    images: [
      Metal_Frame,
      Metal_Frame_2,
      Metal_Frame_3
    ],
    options: ['Blue', 'Silver', 'Black', 'Golden', 'Pink'],
  },
  {
    id: 2,
    title: 'Lanyard',
    description: 'Choose color and quantity',
    images: [
      lanyard_1,
      lanyard_2,
    ],
    options: ['Blue', 'Black', 'Red', 'White', 'Pink', 'Grey'],
  },
  {
    id: 3,
    title: 'ID Card',
    description: 'ID Card & Finish Options',
    images: [
      id_card_1,
      id_card_2,
    ],
    cardOptions: ['PVC', 'Paper'],
    finishOptions: ['Glossy', 'Matte'],
  },
];

type Selections = {
  [key: number]: {
    option: string;
    quantity: number;
    cardType?: string;
    cardFinish?: string;
  };
};

const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="relative aspect-video overflow-hidden">
      {/* Image */}
      <img
        src={images[currentImageIndex]}
        alt={`Product image ${currentImageIndex + 1}`}
        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
      />
      
      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevImage}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNextImage}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Image Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentImageIndex 
                  ? 'bg-white' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function ProductCustomization() {
  const [selections, setSelections] = useState<Selections>({});

  const handleSubmit = async () => {
    try {
      // Validate all selections are made
      const requiredSelections = products.length;
      const currentSelections = Object.keys(selections).length;
      
      if (currentSelections < requiredSelections) {
        toast.error('Please make all selections before submitting');
        return;
      }

      // Validate card type and finish for combined options
      if (!selections[3]?.cardType || !selections[3]?.cardFinish) {
        toast.error('Please select both card type and finish options');
        return;
      }

      const { error } = await supabase.from('product_customizations').insert([
        {
          holder_type: selections[1]?.option,
          holder_quantity: selections[1]?.quantity,
          lanyard_color: selections[2]?.option,
          lanyard_quantity: selections[2]?.quantity,
          card_type: selections[3]?.cardType,
          card_finish: selections[3]?.cardFinish,
        },
      ]);

      if (error) throw error;

      toast.success('Product customization saved successfully!');
      setSelections({});
    } catch (error) {
      console.error('Error saving product customization:', error);
      toast.error('Failed to save product customization');
    }
  };

  const updateSelection = (
    id: number,
    field: 'option' | 'quantity' | 'cardType' | 'cardFinish',
    value: string | number
  ) => {
    setSelections((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-8">
      <Card className="border-t-4 border-t-primary shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Product Customization</CardTitle>
          <CardDescription>
            Customize your ID card package by selecting options for each component
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden border border-primary/20 hover:border-primary/40 transition-colors">
                <CardHeader className="p-0">
                  <ImageCarousel images={product.images} />
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-lg mb-2 text-primary">{product.title}</CardTitle>
                  <CardDescription className="mb-4">
                    {product.description}
                  </CardDescription>
                  
                  {product.id === 3 ? (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-primary">Card Type</Label>
                        <Select
                          value={selections[product.id]?.cardType}
                          onValueChange={(value) => updateSelection(product.id, 'cardType', value)}
                        >
                          <SelectTrigger className="border-primary/20 focus:border-primary">
                            <SelectValue placeholder="Select card type" />
                          </SelectTrigger>
                          <SelectContent>
                            {product.cardOptions?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-primary">Card Finish</Label>
                        <Select
                          value={selections[product.id]?.cardFinish}
                          onValueChange={(value) => updateSelection(product.id, 'cardFinish', value)}
                        >
                          <SelectTrigger className="border-primary/20 focus:border-primary">
                            <SelectValue placeholder="Select finish" />
                          </SelectTrigger>
                          <SelectContent>
                            {product.finishOptions?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-primary">Color</Label>
                        <Select
                          value={selections[product.id]?.option}
                          onValueChange={(value) => updateSelection(product.id, 'option', value)}
                        >
                          <SelectTrigger className="border-primary/20 focus:border-primary">
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            {product.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-primary">Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={selections[product.id]?.quantity || ''}
                          onChange={(e) => updateSelection(product.id, 'quantity', parseInt(e.target.value) || 0)}
                          className="border-primary/20 focus:border-primary"
                          placeholder="Enter quantity"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end mt-8">
            <Button size="lg" className="px-8" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};