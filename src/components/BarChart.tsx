import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PaymentChart = ({ customerTotal, wholesalerTotal }: {
    customerTotal: number,
    wholesalerTotal: number
}) => {
    const data = {
        labels: ['Customer remaining Paymnet', 'Total Payable to Wholesaler'],
        datasets: [
            {
                label: 'Amount',
                data: [customerTotal, wholesalerTotal],
                backgroundColor: ['#82ca9d', '#8884d8'],
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Payment Overview',
            },
        },
    };
    return <Bar data={data} options={options as any} />;
};

export default PaymentChart;