import { useState, useEffect } from 'react';
import { Product } from '@/types/Inventory';
import inventoryApi from '@/services/inventoryApi';

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

const InventoryPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await inventoryApi.getAllProducts();
                if (response?.documents[0].$id) {

                    const data: Product[] = response.documents.map((doc: any) => ({
                        $id: doc.$id,
                        name: doc.name || "",
                        units: doc.units || 0,
                        price: doc.price || 0,
                        description: doc.description || ""
                    }));

                    setProducts(data);
                    console.log(data, "data");
                } else {
                    console.error('No data found in response');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products
        .filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.price - b.price;
            } else {
                return b.price - a.price;
            }
        });

    const handleRowClick = (id: string) => {
        navigate(`/update-product/${id}`);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Product List</h1>
            <div className='flex flex-col md:flex-row justify-between mb-4'>
                <input
                    type="text"
                    placeholder="Search products"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-600 rounded mb-2 md:mb-0 md:mr-2"
                />
                <Button onClick={() => navigate('/new-product')}>Add Product</Button>
            </div>
            <div className='flex flex-col md:flex-row justify-between mb-4'>
                <Button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                    Sort by Price ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
                </Button>
            </div>
            <div className="overflow-x-auto">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead style={{ backgroundColor: 'rgba(173, 216, 230, 0.7)' }}>Sn</TableHead>
                            <TableHead style={{ backgroundColor: 'rgba(173, 216, 230, 0.7)' }}>Name</TableHead>
                            <TableHead style={{ backgroundColor: 'rgba(173, 216, 230, 0.7)' }}>Quantity</TableHead>
                            <TableHead style={{ backgroundColor: 'rgba(173, 216, 230, 0.7)' }}>Price</TableHead>
                            <TableHead style={{ backgroundColor: 'rgba(173, 216, 230, 0.7)' }}>Description</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product, i) => (
                            <TableRow key={product.$id + i} onDoubleClick={() => handleRowClick(product.$id)} >
                                <TableCell>{i + 1}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.units}</TableCell>
                                <TableCell style={{ backgroundColor: 'rgba(255, 255, 0, 0.4)' }}>{product.price}</TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default InventoryPage;