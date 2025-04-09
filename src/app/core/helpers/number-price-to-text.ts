export const numberPriceToTextHelper = {
  /**
   * Chuyển đổi chuỗi đã format thành số
   */
  parseFormattedNumber(value: any): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return value;
    return Number(value.toString().replace(/[^\d]/g, '')) || 0;
  },

  /**
   * Chuyển đổi số thành chữ tiếng Việt
   * @param number Số cần chuyển đổi
   * @returns Chuỗi biểu diễn số tiền bằng chữ
   */
  numberToVietnameseText(number: number): string {
    if (number === 0) return 'Không đồng';
    
    const units = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    const tens = ['', 'mười', 'hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi'];
    
    const readThreeDigits = (num: number): string => {
      const hundred = Math.floor(num / 100);
      const ten = Math.floor((num % 100) / 10);
      const unit = num % 10;
      
      let result = '';
      
      if (hundred > 0) {
        result += units[hundred] + ' trăm';
      }
      
      if (ten > 0 || (hundred > 0 && unit > 0)) {
        if (ten === 0 && hundred > 0) {
          result += ' lẻ';
        } else if (ten === 1) {
          result += ' mười';
          if (unit > 0) {
            if (unit === 1) {
              result += ' một';
            } else if (unit === 5) {
              result += ' lăm';
            } else {
              result += ' ' + units[unit];
            }
          }
          return result;
        } else if (ten > 1) {
          result += ' ' + tens[ten];
        }
      }
      
      if (unit > 0) {
        if (ten > 1 && unit === 1) {
          result += ' mốt';
        } else if (ten > 0 && unit === 5) {
          result += ' lăm';
        } else {
          result += ' ' + units[unit];
        }
      }
      
      return result.trim();
    };
    
    if (number === 0) return 'không';
    
    let result = '';
    let unitIndex = 0;
    const unitNames = ['', ' nghìn', ' triệu', ' tỷ', ' nghìn tỷ', ' triệu tỷ'];
    
    while (number > 0) {
      const segment = number % 1000;
      if (segment > 0) {
        const segmentText = readThreeDigits(segment);
        result = segmentText + unitNames[unitIndex] + (result ? ' ' + result : '');
      }
      unitIndex++;
      number = Math.floor(number / 1000);
    }
    
    // Capitalize first letter
    result = result.charAt(0).toUpperCase() + result.slice(1);
    
    return result + ' đồng';
  }
}