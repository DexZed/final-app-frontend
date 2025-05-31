import Swal from "sweetalert2";
import { parseISO, format } from "date-fns";

export function validatePass(password: string): string | null {
  //console.log(`Validating password: ${password}`);
  if (password.length < 6) {
    //console.log("Password length check failed");
    return "Password must be at least 6 characters long.";
  }
  if (!/[A-Z]/.test(password)) {
    //console.log("Uppercase letter check failed");
    return "Password must include at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    //console.log("Lowercase letter check failed");
    return "Password must include at least one lowercase letter.";
  }

  //console.log("Password is valid");
  return null;
}
export function errMsg(err: unknown): err is { message: string } {
  return typeof err === "object" && err !== null && "message" in err;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
}
const MAX_RETRIES = 3;
export const retryRequest = async (fn: () => Promise<any>, retries = MAX_RETRIES) => {
  while (retries > 0) {
    try {
      return await fn();
    } catch (error) {
      retries--;
      if (retries === 0) throw error;
    }
  }
};


// Success alert
export function showSuccessAlert(title: string, text: string): void {
  Swal.fire({
    title,
    text,
    icon: "success",
  });
}

// Error alert
export function showErrorAlert(title: string, text: string): void {
  Swal.fire({
    title,
    text,
    icon: "error",
  });
}

// Confirmation alert with callback
export function showConfirmationAlert(
  title: string,
  text: string,
  confirmText: string,
  cancelText: string,
  onConfirm: () => void
): void {
  Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
    }
  });
}

export const formatTime = (time: string) => {
  if (!time) {
    return "N/A"; // Return a default value if time is undefined or null
  }
  const [hour, minute] = time.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12-hour format
  return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
};

export const getDateRange = (users: { createdAt: string }[]): string | null => {
  if (users?.length === 0) return null;

  const sortedUsers = [...users].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const firstUserDate = parseISO(sortedUsers[0].createdAt);
  const latestUserDate = parseISO(sortedUsers[sortedUsers.length - 1].createdAt);

  const formattedStart = format(firstUserDate, "MMM do yy"); // Example: Jan 1st
  const formattedEnd = format(latestUserDate, "MMM do yy"); // Example: Feb 1st

  return `${formattedStart} - ${formattedEnd}`;
};