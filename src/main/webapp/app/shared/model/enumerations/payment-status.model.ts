export class PaymentStatus {
  public static NEW = new PaymentStatus('NEW', 'Új');
  public static WAITING = new PaymentStatus('WAITING', 'Várakozó');
  public static APPROVED = new PaymentStatus('APPROVED', 'Jóváhagyva');
  public static PAID = new PaymentStatus('PAID', 'Fizetve');
  public static UNPAID = new PaymentStatus('UNPAID', 'Rendezetlen');

  public get Value(): string {
    return this.value;
  }

  public get Name(): string {
    return this.name;
  }

  private constructor(private value: string, private name: string) {}

  public static parse(value: string): PaymentStatus {
    switch (value) {
      case this.WAITING.Value: {
        return this.WAITING;
      }
      case this.APPROVED.Value: {
        return this.APPROVED;
      }
      case this.PAID.Value: {
        return this.PAID;
      }
      case this.UNPAID.Value: {
        return this.UNPAID;
      }
      default: {
        return this.NEW;
      }
    }
  }

  public toString(): string {
    return this.value;
  }
}
