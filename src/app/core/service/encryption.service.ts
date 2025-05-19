import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private secretKey = environment.encryptionKey ;

  // Mã hóa ID thành chuỗi an toàn cho URL
  encryptId(id: number): string {
    if (!id) return '';

    // Chuyển ID thành chuỗi
    const idStr = id.toString();

    // Mã hóa chuỗi
    const encrypted = CryptoJS.AES.encrypt(idStr, this.secretKey).toString();

    // Chuyển đổi thành định dạng an toàn cho URL
    return this.makeUrlSafe(encrypted);
  }

  // Giải mã chuỗi URL thành ID
  decryptId(encryptedId: string): number | null {
    if (!encryptedId) return null;

    try {
      // Khôi phục chuỗi mã hóa từ định dạng URL
      const encrypted = this.makeUrlUnsafe(encryptedId);

      // Giải mã
      const decrypted = CryptoJS.AES.decrypt(encrypted, this.secretKey).toString(CryptoJS.enc.Utf8);

      // Chuyển về số
      return parseInt(decrypted, 10);
    } catch (error) {
      console.error('Lỗi giải mã ID:', error);
      return null;
    }
  }

  // Chuyển chuỗi mã hóa thành chuỗi an toàn cho URL
  private makeUrlSafe(str: string): string {
    return str.replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  // Khôi phục chuỗi mã hóa từ chuỗi an toàn cho URL
  private makeUrlUnsafe(str: string): string {
    // Thêm lại các dấu bằng bị bỏ
    const paddingChar = '=';
    const paddingCount = 4 - (str.length % 4);
    const padding = paddingCount < 4 ? paddingChar.repeat(paddingCount) : '';

    return str.replace(/-/g, '+')
      .replace(/_/g, '/')
      + padding;
  }
}
