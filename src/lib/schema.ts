import { z } from "zod";

export const frequencyOptions = ["One time", "Weekly", "Monthly"] as const;

export const donationFormSchema = z.object({
  mosqueName: z.string(),
  amount: z.number().min(1).max(100000),
  currency: z.string(),
  frequency: z.enum(frequencyOptions),
  information: z.string(),
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
  information: "",
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