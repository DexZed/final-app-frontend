export type District = { id: string; division_id: string; name: string };
export type Upazila = { id: string; division_id: string; district_id: string; name: string };

export type DonationRequest = {
  id?: string; // Simplified _id
  requesterName?: string;
  requesterEmail?: string;
  recipientName?: string;
  recipientDistrict?: string;
  recipientUpazila?: string;
  hospitalName?: string;
  fullAddress?: string;
  bloodGroup?: string;
  donationDate?: string; // Simplified ISO date string
  donationTime?: string;
  requestMessage?: string;
  donationStatus?: string;
  createdAt?: string; // Simplified ISO date string
};