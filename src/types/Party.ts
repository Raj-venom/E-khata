export interface Party  {
    $id: string;
    name: string;
    phone: string;
    alternate_phone: string;
    address: string;
    total_amount: number;
    remaining_amount: number;
    remark: string;
    paid_amount: number;
}