import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//Convert Prisma Object to regular JS Object

export function prismaToJSObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

// Shorten ID
export function formatId(id: string) {
  return `${id.substring(id.length - 6)}`;
}

//Format Date and Time
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'en-US',
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    'en-US',
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    'en-US',
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};




//Format Number with decimal places

export function formatNumber(num: number): string {
  const [int, decimal] = num.toFixed(2).split(".")
  return `${int}.${decimal}`
}

//Round Numbers to 2 decimal places
export function roundNumber(value: number | string) {
  if (typeof value === 'number') {
    return Math.round((value + Number.EPSILON) * 100) / 100
  } else if (typeof value === 'string') {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100
  } else {
    throw new Error('Value must be a number or string')
  }
}

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2,
});

// Format currency
export function formatCurrency(amount: number | string | null) {
  if (typeof amount === 'number') {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === 'string') {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else {
    return 'NaN';
  }
}


//Format Errors
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any): string {
  if (error.name === 'ZodError') {
    // Handle Zod error
    const fieldErrors = Object.keys(error.errors).map((field) => {
      const message = error.errors[field].message;
      // console.log(message)
      return typeof message === 'string' ? message : JSON.stringify(message);

    });
    //console.log('Field Errors', fieldErrors)
    return fieldErrors.join('. ');
  } else if (
    error.name === 'PrismaClientKnownRequestError' &&
    error.code === 'P2002'
  ) {
    // Handle Prisma error
    const field = error.meta?.target ? error.meta.target[0] : 'Field';
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    // Handle other errors
    return typeof error.message === 'string'
      ? error.message
      : JSON.stringify(error.message);
  }
}



// The formatError function is a utility function that takes an error object 
// and returns a formatted error message.
//It checks for Zod Error, Prisma Error, and other errors.
//If the Error is a Zod error, then it (Error Array) is passed through Object.keys(error.errors)
//It is then looped through and assigning all messages to a variable called fieldErrors
// Error Errors [
//   {
//     code: 'too_small',
//     minimum: 6,
//     type: 'string',
//     inclusive: true,
//     exact: false,
//     message: 'Confirm password Error.',
//     path: [ 'confirmPassword' ]
//   },
//   {
//     code: 'custom',
//     message: "Passwords don't match.",
//     path: [ 'confirmPassword' ]
//   }
// ]
//If it is a Prisma Error, then it is passed through error.meta?.target
//It is then assigned to a variable called field
// Then it is returned with the first letter capitalized and the rest of the string
// Error Name PrismaClientKnownRequestError
// Error Code P2002
// Error Errors undefined
// Error Meta  [ 'email' ]

// All other errors are returned as a string