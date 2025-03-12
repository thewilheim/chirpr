import axios from "axios";
import { BASE_URL } from "../constrants";

export function randomDate(start = new Date(2024, 0, 1), end = new Date()) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toDateString();
}


export function formatViews(views: number): string {
    const lookup = [
        {value: 1, symbol: ""},
        {value: 1e3, symbol: "k"},
        {value: 1e6, symbol: "M"},
        {value: 1e9, symbol: "B"},
        {value: 1e12, symbol: "T"},
    ]

    const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
    const item = lookup.findLast(item => views >= item.value);
    
    return item ? (views / item.value).toFixed(2).replace(regexp, "").concat(item.symbol) : "0";
}

export const isAuthenticted = () => {
    const cookies = document.cookie.split("; ");
    const authCookie = cookies.find(row => row.startsWith("AuthToken="))
    return !!authCookie;
}

export const handleFileUpload = async (file: File | null, userToken?: string ) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        `${BASE_URL}api/v1/Upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipar/form-data",
            Authorization: `Bearer ${userToken}`
          },

        }
      );
      if (!response) throw new Error("File upload failed");
      console.log("File uploaded successfully:", response);
      return response;
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };