import { revenueLockConfig } from "@/lib/revenue-lock-config";

export type RevenueUnlockResult = {
  success: boolean;
  message?: string;
};

export async function validateRevenuePin(pin: string): Promise<RevenueUnlockResult> {
  const normalizedPin = pin.trim();

  if (!new RegExp(`^\\d{${revenueLockConfig.pinLength}}$`).test(normalizedPin)) {
    return {
      success: false,
      message: `Enter a ${revenueLockConfig.pinLength}-digit PIN.`,
    };
  }

  if (normalizedPin !== revenueLockConfig.adminPin) {
    return {
      success: false,
      message: "Incorrect PIN. Please try again.",
    };
  }

  return { success: true };
}
