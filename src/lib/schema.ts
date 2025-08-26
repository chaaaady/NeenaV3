import { z } from "zod";

export const frequencyOptions = ["One time", "Weekly", "Monthly"] as const;
export const donationTypeOptions = ["Sadaqah", "Zakat"] as const;

export const donationFormSchema = z.object({
  mosqueName: z.string(),
  amount: z.number().min(1).max(100000),
  currency: z.string(),
  frequency: z.enum(frequencyOptions),
  donationType: z.enum(donationTypeOptions),
  information: z.string(),
  donorType: z.enum(["Personal", "In honor of", "Company"] as const),
  tributeName: z.string(),
  isCompany: z.boolean(),
  companySiret: z.string(),
  companyName: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  address: z.string(),
  wantsReceipt: z.boolean(),
  cardNumber: z.string(),
  cardExp: z.string(),
  cardCvc: z.string(),
  coverFees: z.boolean(),
});

export type DonationFormValues = z.infer<typeof donationFormSchema>;

export const defaultDonationValues: DonationFormValues = {
  mosqueName: "Créteil",
  amount: 50,
  currency: "€",
  frequency: "One time",
  donationType: "Sadaqah",
  donorType: "Personal",
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
  cardNumber: "",
  cardExp: "",
  cardCvc: "",
  coverFees: false,
};