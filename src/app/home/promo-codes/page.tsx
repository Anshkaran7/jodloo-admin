'use client'
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import PromoCodeTable from '@/components/ui/PromoCodeList';
import PromoCodeModal from '@/components/ui/PromoCodeForm';

const PromoCodesPage: React.FC = () => {
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddPromoCode = (promoCode: any) => {
    setPromoCodes([...promoCodes, promoCode]);
  };

  return (
    <div className="relative p-4">
      <h1 className="text-2xl font-bold text-[#003654] mb-4">Promo Codes</h1>
      {promoCodes.length > 0 ? (
        <PromoCodeTable promoCodes={promoCodes} />
      ) : (
        <div className="p-4 bg-white border rounded-lg text-center">
          <p className="text-gray-500">There are no promo codes available. Please add a new promo code to get started.</p>
        </div>
      )}
      <button
        title="Add Promo Code"
        className="fixed bottom-10 right-20 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg"
        onClick={() => setIsModalOpen(true)}
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <PromoCodeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddPromoCode={handleAddPromoCode} />
    </div>
  );
};

export default PromoCodesPage;
