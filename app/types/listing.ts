export type Listing = {
  id: string;
  userId: string;
  created_at: string;
  monthlyRentPrice: number;
  leaseTitle: string;
  leaseDescription: string;
  subleaseDurationMonths: number | null;
  isIndefinite: boolean;
  unitType: string;
  livingSpaceType: string;
  additionalRoomCount: number;
  subleaseRoomCount: number;
  tenantCount: number;
  bathRoomCount: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  freeWifi: boolean;
  freeParking: boolean;
  petFriendly: boolean;
  washerDryer: boolean;
  cookingSpace: boolean;
  imageRefs: string[];
};

export type ListingFormData = {
  leaseTitle: string;
  leaseDescription: string;
  unitType: string;
  livingSpaceType: string;
  subleaseDurationMonths: string;
  isIndefinite: boolean;
  monthlyRentPrice: string;
  subleaseRoomCount: string;
  additionalRoomCount: string;
  tenantCount: string;
  bathRoomCount: string;
  address: { street: string; city: string; state: string; zipCode: string };
  amenities: {
    freeWifi: boolean;
    freeParking: boolean;
    petFriendly: boolean;
    washerDryer: boolean;
    cookingSpace: boolean;
  };
};
