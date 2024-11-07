import toast from 'react-hot-toast';

export const ErrorHandler = (error) => {
    const errorData = error.response?.data || {};
    if (errorData.email) {
        toast.error(errorData.email);
    }
    if (errorData.phone) {
        toast.error(errorData.phone);
    }
    if (errorData.password) {
        toast.error(errorData.password);
    }
    if (errorData.address) {
        toast.error(errorData.address);
    }
    if (errorData.name) {
        toast.error(errorData.name);
    }
    else {
        toast.error(errorData.detail || 'An error occurred');
    }
}