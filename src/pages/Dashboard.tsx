import PaymentChart from '@/components/BarChart'
// import Header from '@/components/Header/Header';
import  {  useEffect, useState } from 'react'
import axios from 'axios';


function Dashboard() {
    const [chartData, setChartData] = useState({ totalPartyAmount: 0, totalCustomerAmount: 0 });

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await axios.get('/api/bar-chart');
                console.log(response.data);
                setChartData({
                    totalPartyAmount: response.data.totalPartyAmount || 5511,
                    totalCustomerAmount: response.data.totalCustomerAmount || 5111,
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