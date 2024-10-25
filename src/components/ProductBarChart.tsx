import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const ProductBarChart = ({ productNames, productStock }: {
    productNames: string[],
    productStock: number[]
}) => {

    const totalStock = productStock.reduce((acc, stock) => acc + stock, 0);

    const backgroundColors = productStock.map(stock => {
        if (stock <= 10) return 'rgba(255, 0, 0, 0.8)'; // Red
        if (stock <= 20) return 'rgba(255, 206, 86, 0.6)'; // Yellow
        return '#82ca9d'; // Default color
    });

    const borderColors = productStock.map(stock => {
        if (stock <= 10) return 'rgba(255, 0, 0, 1)'; // Red
        if (stock <= 20) return 'rgba(255, 206, 86, 1)'; // Yellow
        return '#82ca9d'; // Default color
    });

    const data = {
        labels: productNames,
        datasets: [
            {
                label: 'Stock Level',
                data: productStock,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1,
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
                text: 'Product Stock Levels',
            },
            subtitle: {
                display: true,
                text: `Total Stock: ${totalStock}`,
                color: '#333',
                font: {
                    size: 14,
                    weight: 'bold',
                },
                padding: {
                    top: 10,
                    bottom: 20,
                },
            },
            datalabels: {
                display: true,
                color: 'black',
                align: 'end',
                anchor: 'end',
                font: {
                    size: 14,
                    weight: 'bold',
                },
            },
        },
    };

    return <Bar data={data} options={options as any} />;
};

export default ProductBarChart;
