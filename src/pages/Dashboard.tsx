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
                <h2 className='' >Welcome to the dashboard</h2>
            </div>

            <div>
                <div className='flex w-1/2 h-1/2 ml-96  justify-center mt-24'>
            
                <PaymentChart customerTotal={chartData.totalCustomerAmount} wholesalerTotal={chartData.totalPartyAmount}/>

                </div>
            </div>
        </>
    )
}

export default Dashboard