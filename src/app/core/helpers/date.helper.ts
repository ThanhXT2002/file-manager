// date.helper.ts
export class DateHelper {
  // Hàm định dạng ngày tháng theo mẫu "HH:mm, ngày dd/MM/yyyy"
  public static formatDate(date: Date = new Date()): string {
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());
    const day = this.padZero(date.getDate());
    const month = this.padZero(date.getMonth() + 1); // Tháng bắt đầu từ 0
    const year = date.getFullYear();

    return `${hours}:${minutes}, ngày ${day}/${month}/${year}`;
  }

  // Hàm thêm số 0 vào trước nếu giá trị nhỏ hơn 10
  private static padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  public static dateToString(date: Date = new Date(), format: string = 'HH:mm, ngày dd/MM/yyyy'): string {
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());
    const day = this.padZero(date.getDate());
    const month = this.padZero(date.getMonth() + 1);
    const year = date.getFullYear().toString();

    return format
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('dd', day)
      .replace('MM', month)
      .replace('yyyy', year);
  }

  // this.dateNow = DateHelper.formatDate(new Date(), 'dd-MM-yyyy HH:mm');
}
