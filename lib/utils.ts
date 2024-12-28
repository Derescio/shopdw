import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//Convert Prisma Object to regular JS Object

export function prismaToJSObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

//Format Number with decimal places

export function formatNumber(num: number): string {
  const [int, decimal] = num.toString().split(".")
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`
}