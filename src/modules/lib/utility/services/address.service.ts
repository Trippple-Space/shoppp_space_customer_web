import { AxiosResponse } from 'axios';
import endpoints from '../endpoints';
import http from '../http';
import { Address } from '../types/address.interface';
import { buildEndpoint } from '../utility';

class AddressService {
  fetchAddresses(userId: number): Promise<Address[]> {
    return new Promise((resolve, reject) => {
      http.get(buildEndpoint(endpoints.USER_ADDRESSES, {userId}))
        .then((response: AxiosResponse) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject();
        });
    });
  }

  getAddressById(userId: number, addressId: number): Promise<Address> {
    return new Promise((resolve, reject) => {
      http.get(buildEndpoint(endpoints.USER_ADDRESSES, {userId}, `/${addressId}`))
        .then((response: AxiosResponse) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject();
        });
    });
  }

  createAddress(userId: number, newAddress: Address): Promise<Address> {
    return new Promise((resolve, reject) => {
      http.post(buildEndpoint(endpoints.USER_ADDRESSES, {userId}), newAddress)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  updateAddress(userId: number, addressId: number, updatedData: Partial<Address>): Promise<Address> {
    return new Promise((resolve, reject) => {
      http.patch(buildEndpoint(endpoints.USER_ADDRESSES, {userId}, `/${addressId}`), updatedData)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  deleteAddress(userId: number, addressId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      http.delete(buildEndpoint(endpoints.USER_ADDRESSES, {userId}, `/${addressId}`))
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export const addressService = new AddressService();
