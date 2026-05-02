import { AxiosResponse } from 'axios';
import endpoints from '../endpoints';
import http from '../http';
import { Address } from '../types/address.interface';
import { buildEndpoint } from '../utility';

class AddressService {
  fetchAddresses(userId: string): Promise<Address[]> {
    return new Promise((resolve, reject) => {
      http.get(buildEndpoint(endpoints.USER_ADDRESSES, {userId}))
        .then((response: AxiosResponse) => {
          resolve(response.data.data);
        })
        .catch((error) => {
          reject();
        });
    });
  }

  getAddressById(userId: string, addressId: string): Promise<Address> {
    return new Promise((resolve, reject) => {
      http.get(buildEndpoint(endpoints.USER_ADDRESSES))
        .then((response: AxiosResponse) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject();
        });
    });
  }

  createAddress(userId: string, newAddress: Address): Promise<Address> {
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

  createAddressesBulk(userId: string, addresses: Address[]): Promise<Address[]> {
    return new Promise((resolve, reject) => {
      http.post(buildEndpoint(endpoints.USER_ADDRESSES_BULK, { userId }), {
        addresses,
      })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  updateAddress(userId: string, addressId: string, updatedData: Partial<Address>): Promise<Address> {
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

  deleteAddress(userId: string, addressId: string): Promise<void> {
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
