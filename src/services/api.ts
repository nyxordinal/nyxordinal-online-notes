import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const API: AxiosInstance = axios.create({
	baseURL: API_URL,
	headers: { Accept: 'application/json' },
});

const handleResponseReceive = (response: AxiosResponse) => {
	return response.data;
};

const handleResponseError = (error: AxiosError) => {
	return error.response ? error.response.data : error;
};

API.interceptors.response.use(handleResponseReceive, handleResponseError);
