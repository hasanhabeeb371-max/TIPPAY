import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface Address {
  id: string;
  label: string; // Home, Work, Other
  fullAddress: string;
  landmark?: string;
  phone: string;
  isDefault: boolean;
}

interface AddressContextType {
  addresses: Address[];
  selectedAddress: Address | null;
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefault: (id: string) => void;
  selectAddress: (id: string) => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

const STORAGE_KEY = "tippay_addresses";

const defaultAddresses: Address[] = [
  { id: "addr-1", label: "Home", fullAddress: "42, MG Road, Koramangala, Bangalore - 560034", landmark: "Near Forum Mall", phone: "+91 98765 43210", isDefault: true },
  { id: "addr-2", label: "Work", fullAddress: "Tech Park, Whitefield Main Road, Bangalore - 560066", landmark: "Building C, 3rd Floor", phone: "+91 98765 43210", isDefault: false },
];

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [addresses, setAddresses] = useState<Address[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultAddresses;
    } catch {
      return defaultAddresses;
    }
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses]);

  const selectedAddress = addresses.find((a) => a.id === selectedId) || addresses.find((a) => a.isDefault) || addresses[0] || null;

  const addAddress = useCallback((addr: Omit<Address, "id">) => {
    const id = `addr-${Date.now()}`;
    setAddresses((prev) => {
      const updated = addr.isDefault ? prev.map((a) => ({ ...a, isDefault: false })) : prev;
      return [...updated, { ...addr, id }];
    });
  }, []);

  const updateAddress = useCallback((id: string, partial: Partial<Address>) => {
    setAddresses((prev) =>
      prev.map((a) => {
        if (a.id !== id) return partial.isDefault ? { ...a, isDefault: false } : a;
        return { ...a, ...partial };
      })
    );
  }, []);

  const deleteAddress = useCallback((id: string) => {
    setAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
  }, []);

  const setDefault = useCallback((id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  }, []);

  const selectAddress = useCallback((id: string) => setSelectedId(id), []);

  return (
    <AddressContext.Provider value={{ addresses, selectedAddress, addAddress, updateAddress, deleteAddress, setDefault, selectAddress }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const ctx = useContext(AddressContext);
  if (!ctx) throw new Error("useAddress must be used within AddressProvider");
  return ctx;
};
