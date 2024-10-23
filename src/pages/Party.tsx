import { useState, useEffect } from 'react';
import { Party } from '@/types/Party';
import partyApi from '@/services/partyApi';

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

const PartyPage = () => {
    const navigate = useNavigate()

    const [parties, setParties] = useState<Party[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showRemainingAmountOnly, setShowRemainingAmountOnly] = useState(true);
    const [paidAmountUserOnly, setPaidAmountUserOnly] = useState(false);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');


    useEffect(() => {
        const fetchParties = async () => {
            try {
                const response = await partyApi.getAllParties(showRemainingAmountOnly, searchTerm.trim(), paidAmountUserOnly);
                console.log(response, "parties response");
                if (response?.documents) {
                    // @ts-ignore
                    const data: Party[] = response.documents;
                    setParties(data);
                    console.log(data, "data");
                } else {
                    console.error('No data found in response');
                }
            } catch (error) {
                console.error('Error fetching parties:', error);
            }
        };

        fetchParties();
    }, [showRemainingAmountOnly, searchTerm, paidAmountUserOnly]);

    const filteredParties = parties
        .sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.remaining_amount - b.remaining_amount;
            } else {
                return b.remaining_amount - a.remaining_amount;
            }
        });

    const handleRowClick = (id: string) => {
        navigate(`/update-party/${id}`);
    };

    return (
        <>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Party List</h1>
                <div className='flex flex-col md:flex-row justify-between mb-4'>
                    <input
                        type="text"
                        placeholder="Search parties"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPaidAmountUserOnly(false);
                            setShowRemainingAmountOnly(false);
                        }}
                        className="p-2 border border-gray-600 rounded mb-2 md:mb-0 md:mr-2"
                    />
                    <Button onClick={() => navigate('/new-party')}>Add Party</Button>
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
                            Show Paid Amount Parties Only
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
                                <TableHead style={{ backgroundColor: 'rgba(173, 216, 230, 0.7)' }}>Alter Phone</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredParties.length === 0 && (<TableRow><TableCell colSpan={8}>No data found</TableCell></TableRow>)}

                            {filteredParties.length > 0 && filteredParties.map((party, i) => (
                                <TableRow key={party.$id + i} onDoubleClick={() => handleRowClick(party.$id)} >
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell>{party.name}</TableCell>
                                    <TableCell>
                                        <a href={`tel:${party.phone}`}>{party.phone}</a>
                                    </TableCell>
                                    <TableCell>{party.address}</TableCell>
                                    <TableCell style={{ backgroundColor: 'rgba(255, 255, 0, 0.4)' }}>{party.total_amount}</TableCell>
                                    <TableCell style={{ backgroundColor: 'rgba(0, 128, 0, 0.6)' }}>{party.paid_amount}</TableCell>
                                    <TableCell style={{ backgroundColor: 'rgba(255, 204, 204, 0.9)' }}>{party.remaining_amount}</TableCell>
                                    <TableCell>{party.remark}</TableCell>
                                    <TableCell>{party.alternate_phone}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
};

export default PartyPage;
