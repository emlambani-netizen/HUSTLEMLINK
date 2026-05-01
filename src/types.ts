/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  location: string;
  category: string;
  image: string;
  sellerWhatsApp: string;
  isSponsored?: boolean;
}

export interface AdPrompt {
  name: string;
  price: string;
  location: string;
  description?: string;
}
