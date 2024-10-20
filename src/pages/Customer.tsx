import { useState, useEffect } from 'react';
import { Customer } from '@/types/Customer';
import customerApi from '@/services/customerApi';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom'
// import Header from '@/components/Header/Header';

const CustomerPage = () => {
    const navigate = useNavigate()
    const [customers, setCustomers] = useState<Customer[]>([{ $id: "", name: "", phone: "", address: "", total_amount: 0, remaining_amount: 0, remark: "", paid_amount: 0 }]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showRemainingOnly, setShowRemainingOnly] = useState(true);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await customerApi.getAllCustomers();
                // if (response?.documents) {
                //     const data: Customer[] = response.documents;
                //     setCustomers(response.documents);
                //     console.log(data, "data");
                // } else {
                //     console.error('No data found in response');
                // }

                console.log(response, "response");
                if (response?.documents) {
                    // @ts-ignore
                    const data: Customer[] = response.documents;
                    setCustomers(data);
                    console.log(data, "data");
                } else {
                    console.error('No data found in response');
                }
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        fetchCustomers();
    }, []);

    const filteredCustomers = customers
        .filter(customer =>
            (customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.phone.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (!showRemainingOnly || customer.remaining_amount > 0)
        )
        .sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.remaining_amount - b.remaining_amount;
            } else {
                return b.remaining_amount - a.remaining_amount;
            }
        });

    const handleRowClick = (id: string) => {
        navigate(`/update-customer/${id}`);
    };

    return (
        <>


            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Customer List</h1>
                <div className='flex flex-col md:flex-row justify-between mb-4'>
                    <input
                        type="text"
                        placeholder="Search customers"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border border-gray-600 rounded mb-2 md:mb-0 md:mr-2"
                    />
                    <Button onClick={() => navigate('/new-customer')}>Add Customer</Button>
                </div>
                <div className='flex flex-col md:flex-row justify-between mb-4'>
                    <label className="flex items-center mb-2 md:mb-0">
                        <input
                            type="checkbox"
                            checked={showRemainingOnly}
                            onChange={(e) => setShowRemainingOnly(e.target.checked)}
                            className="mr-2"
                        />
                        Show only customers with remaining amount
                    </label>
                    <Button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                        Sort by Remaining Amount ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <Table className="min-w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Sn</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>Total Amount</TableHead>
                                <TableHead>Paid Amount</TableHead>
                                <TableHead>Remaining Amount</TableHead>
                                <TableHead>Remark</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCustomers.map((customer, i) => (
                                <TableRow key={customer.$id + i} onDoubleClick={() => handleRowClick(customer.$id)} >
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell>{customer.name}</TableCell>
                                    <TableCell>{customer.phone}</TableCell>
                                    <TableCell>{customer.address}</TableCell>
                                    <TableCell>{customer.total_amount}</TableCell>
                                    <TableCell>{customer.paid_amount}</TableCell>
                                    <TableCell>{customer.remaining_amount}</TableCell>
                                    <TableCell>{customer.remark}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
};

export default CustomerPage;
