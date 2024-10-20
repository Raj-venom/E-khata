import PaymentChart from '@/components/BarChart'
// import Header from '@/components/Header/Header';
import  {  useEffect, useState } from 'react'
import dashboardApi from '@/services/dashboardApi';


function Dashboard() {
    const [chartData, setChartData] = useState({ totalPartyAmount: 0, totalCustomerAmount: 0 });

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await dashboardApi.getTotalAmounts();
                console.log(response);
                setChartData({
                    totalPartyAmount: response.totalPartyAmount || 0,
                    totalCustomerAmount: response.totalCustomerAmount ||0,
                });
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };

        fetchChartData();
    }, []);

    return (
        <>
            {/* <Header /> */}

            <div className='flex mt-6 text-3xl justify-center'>
                <h2 className='text-center'>Welcome to the dashboard</h2>
            </div>

            <div className='flex flex-col items-center mt-6'>
                <div className='w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-2/4'>
                    <PaymentChart customerTotal={chartData.totalCustomerAmount} wholesalerTotal={chartData.totalPartyAmount}/>
                </div>
            </div>
        </>
    )
}

export default Dashboard