'use client'

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import PromoCodeTable from '@/components/ui/PromoCodeList';
import PromoCodeModal from '@/components/ui/PromoCodeForm';
import { Input } from '@/components/ui/input';

const PromoCodesPage: React.FC = () => {
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddPromoCode = (promoCode: any) => {
    setPromoCodes([...promoCodes, promoCode]);
  };

  return (
    <div className="relative p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#003654] mb-4 md:mb-6 lg:mb-8">Promo Codes</h1>
      <Input
        placeholder="Search by name or code"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border rounded-lg w-full"
      />
      {promoCodes.length > 0 ? (
        <PromoCodeTable promoCodes={promoCodes} searchQuery={searchQuery} />
      ) : (
        <div className="p-4 bg-white border rounded-lg text-center">
          <p className="text-gray-500">There are no promo codes available. Please add a new promo code to get started.</p>
        </div>
      )}
      <button
        title="Add Promo Code"
        className="fixed bottom-10 right-10 md:right-20 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg"
        onClick={() => setIsModalOpen(true)}
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <PromoCodeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddPromoCode={handleAddPromoCode} />
    </div>
  );
};

export default PromoCodesPage;
