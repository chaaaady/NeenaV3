import { z } from "zod";
import { DONATION_TYPES, DONOR_TYPES, FREQUENCIES } from "@/lib/constants";

export const frequencyOptions = FREQUENCIES;
export const donationTypeOptions = DONATION_TYPES;

export const donationFormSchema = z.object({
  mosqueName: z.string(),
  amount: z.number().min(1).max(100000),
  currency: z.string(),
  frequency: z.enum(frequencyOptions),
  donationType: z.enum(donationTypeOptions),
  specialDonation: z.string().optional().nullable(),
  information: z.string(),
  donorType: z.enum(DONOR_TYPES),
  tributeName: z.string(),
  isCompany: z.boolean(),
  companySiret: z.string(),
  companyName: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  address: z.string(),
  wantsReceipt: z.boolean(),
  coverFees: z.boolean(),
});

export type DonationFormValues = z.infer<typeof donationFormSchema>;

export const defaultDonationValues: DonationFormValues = {
  mosqueName: "Créteil",
  amount: 25,
  currency: "€",
  frequency: "Unique",
  donationType: "Sadaqah",
  specialDonation: null,
  donorType: "Personnel",
  information: "",
  tributeName: "",
  isCompany: false,
  companySiret: "",
  companyName: "",
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  wantsReceipt: false,
  coverFees: false,
};