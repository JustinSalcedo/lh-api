export interface ITransactionDocument extends ITransaction {}

export interface ITransaction {
    amount: number
    description: string
    dateInMs: number
}
