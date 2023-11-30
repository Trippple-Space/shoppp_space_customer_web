import { AxiosResponse } from 'axios';
import endpoints from '../endpoints';
import http from '../http';
import { Address } from '../types/address.interface';

class AddressService {
  fetchAddresses(userId: number): Promise<Address[]> {
    return new Promise((resolve, reject) => {
      http.get(`${endpoints.USER_ADDRESSES}/${userId}`)
        .then((response: AxiosResponse) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error('Error fetching addresses:', error);
          reject();
        });
    });
  }

  getAddressById(addressId: number): Promise<Address> {
    return new Promise((resolve, reject) => {
      http.get(`${endpoints.USER_ADDRESSES}/${addressId}`)
        .then((response: AxiosResponse) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error('Error fetching address by ID:', error);
          reject();
        });
    });
  }

  createAddress(userId: number, newAddress: Address): Promise<Address> {
    return new Promise((resolve, reject) => {
      http.post(`${endpoints.USER_ADDRESSES}/${userId}`, newAddress)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error('Error creating address:', error);
          reject(error);
        });
    });
  }

  updateAddress(addressId: number, updatedData: Partial<Address>): Promise<Address[]> {
    return new Promise((resolve, reject) => {
      http.patch(`${endpoints.USER_ADDRESSES}/${addressId}`, updatedData)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error('Error updating address:', error);
          reject(error);
        });
    });
  }

  deleteAddress(addressId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      http.delete(`${endpoints.USER_ADDRESSES}/${addressId}`)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.error('Error deleting address:', error);
          reject(error);
        });
    });
  }
}

export const addressService = new AddressService();
