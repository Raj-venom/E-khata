import { useState, useEffect } from 'react';
import { Party } from '@/types/Party';

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
import partyApi from '@/services/partyApi';
// import Header from '@/components/Header/Header';


const PartyPage = () => {
    const navigate = useNavigate()

    const [parties, setParties] = useState<Party[]>([]);
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
            {/* <Header /> */}

            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Party List</h1>
                <div className='flex flex-col md:flex-row justify-between mb-4'>
                    <input
                        type="text"
                        placeholder="Search parties"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border border-gray-600 rounded mb-2 md:mb-0"
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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Sn</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>Total Amount</TableHead>
                                <TableHead>Remaining Amount</TableHead>
                                <TableHead>Remark</TableHead>
                                <TableHead>Alter Phone</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredParties.map((party, i) => (
                                <TableRow key={party.$id + i} onDoubleClick={() => handleRowClick(party.$id)} >
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell>{party.name}</TableCell>
                                    <TableCell>{party.phone}</TableCell>
                                    <TableCell>{party.address}</TableCell>
                                    <TableCell>{party.total_amount}</TableCell>
                                    <TableCell>{party.remaining_amount}</TableCell>
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
