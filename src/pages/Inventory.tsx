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
    const [sortByStock, setSortByStock] = useState(false);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await inventoryApi.getAllProducts();
                if (response?.documents) {
                    // @ts-ignore
                    const data: Product[] = response.documents;
                    setProducts(data);
                    console.log(data, "data");
                } else {
                    setProducts([]);
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
            if (sortByStock) {
                return a.stock - b.stock;
            }
            return a.name.localeCompare(b.name);
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
                <div className='flex gap-4 '>

                    <label className="flex items-center mb-2 md:mb-0">
                        <input
                            type="checkbox"
                            checked={sortByStock}
                            onChange={() => setSortByStock(!sortByStock)}
                            className="mr-2"
                        />
                        Sort by stock
                    </label>
                </div>
            </div>
            <div className="overflow-x-auto">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead style={{ backgroundColor: 'rgba(173, 216, 230, 0.7)' }}>Sn</TableHead>
                            <TableHead style={{ backgroundColor: 'rgba(173, 216, 230, 0.7)' }}>Name</TableHead>
                            <TableHead style={{ backgroundColor: 'rgba(173, 216, 230, 0.7)' }}>Stock</TableHead>
                            <TableHead style={{ backgroundColor: 'rgba(173, 216, 230, 0.7)' }}>Price</TableHead>
                            <TableHead style={{ backgroundColor: 'rgba(173, 216, 230, 0.7)' }}>Description</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.length === 0 && (<TableRow><TableCell colSpan={5}>No data found</TableCell></TableRow>)}
                        {filteredProducts.length > 0 && filteredProducts.map((product, i) => (
                            <TableRow key={product.$id + i} onDoubleClick={() => handleRowClick(product.$id)} >
                                <TableCell>{i + 1}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell style={{ backgroundColor: product.stock <= 10 ? 'rgba(255, 0, 0, 1)' : 'rgba(0, 128, 0, 0.6)' }}>
                                    {product.stock}
                                </TableCell>
                                <TableCell style={{ backgroundColor: 'rgba(255, 255, 0, 0.6)' }}>{product.price}</TableCell>
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