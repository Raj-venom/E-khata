// import axios from 'axios'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Header() {
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await axios.get('/v1/user/logout')
            navigate('/login')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <header>
            <div className='flex justify-between bg-gray-800 py-4  '>
                <div className='flex justify-between items-center '>

                    <div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className='text-white inline-bock px-6 py-2 duration-200 hover:text-black hover:bg-blue-100 rounded-full'>
                            Dashboard
                        </button>
                    </div>

                    <div>
                        <button
                            onClick={() => navigate('/customer')}
                            className='text-white inline-bock px-6 py-2 duration-200 hover:text-black hover:bg-blue-100 rounded-full'>
                            Customer
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={() => navigate('/party')}
                            className='text-white inline-bock px-6 py-2 duration-200 hover:text-black hover:bg-blue-100 rounded-full'>
                            Party
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={() => navigate('/inventory')}
                            className='text-white inline-bock px-6 py-2 duration-200 hover:text-black hover:bg-blue-100 rounded-full'>
                            Inventory
                        </button>
                    </div>
                </div>
                <div>
                    <button
                        onClick={() => handleLogout()}
                        className='text-white inline-bock px-6 py-2 duration-200 hover:text-black hover:bg-blue-100 rounded-full'>
                        Logout</button>
                </div>

            </div>
        </header>
    )
}

export default Header