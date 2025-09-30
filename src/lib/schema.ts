import { z } from "zod";
import { DONATION_TYPES, DONOR_TYPES, FREQUENCIES } from "@/lib/constants";

export const frequencyOptions = FREQUENCIES;
export const donationTypeOptions = DONATION_TYPES;

const identityOptions = ["Personnel", "Entreprise"] as const;
const identitySchema = z.enum(identityOptions);

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
    identityType: identitySchema.default("Personnel"),
    companySiret: z.string().optional().default(""),
    companyName: z.string().optional().default(""),
    firstName: z.string().optional().default(""),
    lastName: z.string().optional().default(""),
    email: z.string().email().optional().default(""),
    address: z.string().optional().default(""),
    wantsReceipt: z.boolean().default(false),
    coverFees: z.boolean().default(false),
    cardNumber: z.string().optional().default(""),
    cardExp: z.string().optional().default(""),
    cardCvc: z.string().optional().default(""),
  });

export type DonationFormValues = z.infer<typeof donationFormSchema>;
export type DonationFormSchema = typeof donationFormSchema;

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
  cardNumber: "",
  cardExp: "",
  cardCvc: "",
};