export interface Deposit{
  id: string,
  customerId: string,
  interestRate: number,
  depositId : string,
  primaryHolder : string,
  secondryHolder: string,
  bank: string,
  branch: string,
  amount: number,
  tenure: number,
  renewalDate: string,
  emailId: string
}

