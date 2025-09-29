import { z } from "zod";
import { DONATION_TYPES, DONOR_TYPES, FREQUENCIES } from "@/lib/constants";

export const frequencyOptions = FREQUENCIES;
export const donationTypeOptions = DONATION_TYPES;

export const donationFormSchema = z.object({
  mosqueName: z.string().min(1),
  amount: z.number().min(1).max(100000),
  currency: z.string().min(1),
  frequency: z.enum(frequencyOptions),
  donationType: z.enum(donationTypeOptions),
  specialDonation: z.string().optional().nullable(),
  information: z.string().optional().default(""),
  donorType: z.enum(DONOR_TYPES),
  tributeName: z.string().optional().default(""),
  identityType: z.enum(["Personnel", "Entreprise"]).default("Personnel"),
  companySiret: z.string().optional().default(""),
  companyName: z.string().optional().default(""),
  firstName: z.string().optional().default(""),
  lastName: z.string().optional().default(""),
  email: z.string().email().optional().default(""),
  address: z.string().optional().default(""),
  wantsReceipt: z.boolean().default(false),
  coverFees: z.boolean().default(false),
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
  identityType: "Personnel",
  companySiret: "",
  companyName: "",
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  wantsReceipt: false,
  coverFees: false,
};