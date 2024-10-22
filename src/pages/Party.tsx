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

    const [parties, setParties] = useState<Party[]>([{ $id: "", name: "", phone: "", address: "", total_amount: 0, remaining_amount: 0, remark: "", alternate_phone: "", paid_amount: 0 }]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showRemainingOnly, setShowRemainingOnly] = useState(true);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        const fetchParties = async () => {
            try {
                const response = await partyApi.getAllParties();
                console.log(response, "response");
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
    }, []);

    const filteredParties = parties
        .filter(party =>
            (party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                party.phone.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (!showRemainingOnly || party.remaining_amount > 0)
        )
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
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border border-gray-600 rounded mb-2 md:mb-0 md:mr-2"
                    />
                    <Button onClick={() => navigate('/new-party')}>Add Party</Button>
                </div>
                <div className='flex flex-col md:flex-row justify-between mb-4'>
                    <label className="flex items-center mb-2 md:mb-0">
                        <input
                            type="checkbox"
                            checked={showRemainingOnly}
                            onChange={(e) => setShowRemainingOnly(e.target.checked)}
                            className="mr-2"
                        />
                        Show only parties with remaining amount
                    </label>
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
                            {filteredParties.map((party, i) => (
                                <TableRow key={party.$id + i} onDoubleClick={() => handleRowClick(party.$id)} >
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell>{party.name}</TableCell>
                                    <TableCell>{party.phone}</TableCell>
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
