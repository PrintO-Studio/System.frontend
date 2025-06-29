import { toast } from "vue-sonner";

export function displaySonnerError(error) {
  if (error?.response?.data) toast.error(error.response.data.title);
}

export function displaySonnerSuccess(title, action) {
  toast.success(title, {
    action,
  });
}
