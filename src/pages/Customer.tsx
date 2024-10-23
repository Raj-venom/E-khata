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
    const navigate = useNavigate();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showRemainingAmountOnly, setShowRemainingAmountOnly] = useState(true);
    const [paidAmountUserOnly, setPaidAmountUserOnly] = useState(false);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await customerApi.getAllCustomers(showRemainingAmountOnly, searchTerm.trim(), paidAmountUserOnly);
                if (response?.documents) {
                    // @ts-ignore
                    const data: Customer[] = response.documents;
                    console.log(data, 'data');
                    setCustomers(data);
                } else {
                    setCustomers([]);
                    console.error('No data found in response');
                }
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        fetchCustomers();
    }, [showRemainingAmountOnly, searchTerm, paidAmountUserOnly]);



    const filteredCustomers = customers
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
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPaidAmountUserOnly(false);
                            setShowRemainingAmountOnly(false);

                        }}
                        className="p-2 border border-gray-600 rounded mb-2 md:mb-0 md:mr-2"
                    />
                    <Button onClick={() => navigate('/new-customer')}>Add Customer</Button>
                </div>
                <div className='flex flex-col md:flex-row justify-between mb-4'>
                    <div className='flex gap-4 '>
                        <label className="flex items-center mb-2 md:mb-0">
                            <input
                                type="checkbox"
                                checked={showRemainingAmountOnly}
                                onChange={(e) => {
                                    setShowRemainingAmountOnly(e.target.checked);
                                    if (e.target.checked) {
                                        setPaidAmountUserOnly(false);
                                    }
                                }}
                                className="mr-2"
                            />
                            Show Remaining Amount Only
                        </label>

                        <label className="flex items-center mb-2 md:mb-0">
                            <input
                                type="checkbox"
                                checked={paidAmountUserOnly}
                                onChange={(e) => {
                                    setPaidAmountUserOnly(e.target.checked);
                                    if (e.target.checked) {
                                        setShowRemainingAmountOnly(false);
                                    }
                                }}
                                className="mr-2"
                            />
                            Show Paid Amount Customers Only
                        </label>

                    </div>


                    <Button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                        Sort by Remaining Amount ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
                    </Button>


                </div>
                <div className="overflow-x-auto">
                    <Table className="min-w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead style={{ backgroundColor: 'rgba(173, 216, 230, 0.7)' }}>Sn</TableHead>
                                <TableHead style={{ backgroundColor: 'rgba(173, 216, 230, 0.7)' }}>Name</TableHead>
                                <TableHead style={{ backgroundColor: 'rgba(173, 216, 230, 0.7)' }}>Phone</TableHead>
                                <TableHead style={{ backgroundColor: 'rgba(173, 216, 230, 0.7)' }}>Address</TableHead>
                                <TableHead style={{ backgroundColor: 'rgba(173, 216, 230, 0.7)' }}>Total Amount</TableHead>
                                <TableHead style={{ backgroundColor: 'rgba(173, 216, 230, 0.7)' }}>Paid Amount</TableHead>
                                <TableHead style={{ backgroundColor: 'rgba(173, 216, 230, 0.7)' }}>Remaining Amount</TableHead>
                                <TableHead style={{ backgroundColor: 'rgba(173, 216, 230, 0.7)' }}>Remark</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCustomers.length === 0 && (<TableRow><TableCell colSpan={8}>No data found</TableCell></TableRow>)}


                            {filteredCustomers.length > 0 && filteredCustomers.map((customer, i) => (
                                <TableRow key={customer.$id + i} onDoubleClick={() => handleRowClick(customer.$id)} >
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell>{customer.name}</TableCell>
                                    <TableCell>
                                        <a href={`tel:${customer.phone}`}>{customer.phone}</a>
                                    </TableCell>
                                    <TableCell>{customer.address}</TableCell>
                                    <TableCell style={{ backgroundColor: 'rgba(255, 255, 0, 0.4)' }}>{customer.total_amount}</TableCell>
                                    <TableCell style={{ backgroundColor: 'rgba(0, 128, 0, 0.6)' }}>{customer.paid_amount}</TableCell>
                                    <TableCell style={{ backgroundColor: 'rgba(255, 204, 204, 0.9)' }}>{customer.remaining_amount}</TableCell>
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
