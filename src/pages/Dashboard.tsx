import PaymentChart from '@/components/PaymentChart'
// import Header from '@/components/Header/Header';
import { useEffect, useState } from 'react'
import dashboardApi from '@/services/dashboardApi';
import ProductBarChart from '@/components/ProductBarChart';


function Dashboard() {
    const [chartData, setChartData] = useState({ totalPartyAmount: 0, totalCustomerAmount: 0 });
    const [inventoryData, setInventoryData] = useState<{ productNames: string[], productStock: number[] }>({ productNames: [], productStock: [] });

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const paymentChart = await dashboardApi.getTotalAmounts();
                console.log(paymentChart);
                setChartData({
                    totalPartyAmount: paymentChart.totalPartyAmount || 0,
                    totalCustomerAmount: paymentChart.totalCustomerAmount || 0,
                });
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }

            try {
                const inventoryChart = await dashboardApi.getProductStock();
                console.log(inventoryChart);
                setInventoryData({
                    productNames: inventoryChart.productNames || [],
                    productStock: inventoryChart.productStock || [],
                });
            } catch (error) {
                console.error('Error fetching inventory data:', error);
            }
        };

        fetchChartData();
    }, []);

    return (
        <>
            <div className='flex flex-col items-center mt-6 px-4 sm:px-0'>
                <h2 className='text-center text-3xl font-bold text-gray-800 mb-4'>Welcome to the Dashboard</h2>
            </div>

            <div className='flex flex-col md:flex-row justify-center gap-8 items-center mt-6 space-y-6'>
                <div className='w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white shadow-lg rounded-lg p-4'>
                    <PaymentChart customerTotal={chartData.totalCustomerAmount} wholesalerTotal={chartData.totalPartyAmount} />
                </div>
                <div className='w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white shadow-lg rounded-lg p-4'>
                    <ProductBarChart productNames={inventoryData.productNames} productStock={inventoryData.productStock} />
                </div>
            </div>
        </>
    )
}

export default Dashboard