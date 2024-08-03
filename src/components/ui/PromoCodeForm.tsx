import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const PromoCodeModal: React.FC<{ isOpen: boolean, onClose: () => void, onAddPromoCode: (promoCode: any) => void }> = ({ isOpen, onClose, onAddPromoCode }) => {
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [influencer, setInfluencer] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newPromoCode = { code, discount, influencer };
    onAddPromoCode(newPromoCode);
    setCode('');
    setDiscount('');
    setInfluencer('');
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Card>
                  <CardHeader>
                    <CardTitle>Create Promo Code</CardTitle>
                    <CardDescription>Fill in the details to create a new promo code.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700">Promo Code</label>
                        <input
                          type="text"
                          placeholder='e.g. "SUMMER21"'
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700">Discount</label>
                        <input
                        placeholder='e.g. "10"'
                          type="number"
                          value={discount}
                          onChange={(e) => setDiscount(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700">Influencer</label>
                        <input
                        placeholder='e.g. "Jodloo"'
                          type="text"
                          value={influencer}
                          onChange={(e) => setInfluencer(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg"
                          required
                        />
                      </div>
                      <div className="mt-4">
                        <button
                          type="submit"
                          className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg"
                        >
                          Add Promo Code
                        </button>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 text-white bg-red-600 rounded-lg"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                  </CardFooter>
                </Card>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PromoCodeModal;
