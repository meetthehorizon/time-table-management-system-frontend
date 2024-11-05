import axios from "axios";
import { useEffect, useState } from "react";
import { server } from "../main";
import { toast } from 'react-hot-toast';

export const FetchAllSchool = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${server}/school`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    }
    catch (error) {
        toast.error(error.response.data.detail);
        return null;
    }
}