import { useEffect, useState } from 'react';  
import { useRouter } from 'next/router'; 
import axios from 'axios';

export default function Products() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        available: false,
    });

    const router = useRouter();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8000/api/products', 
            formData, {
                headers: {
                    Authorization : `Bearer ${token}`,
                },
            });
            router.push('/products');
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || 'Failed to create product');
        }
    };

    const handleShowProducts = () => {
        router.push('show-products');
    }

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
                <h2 className="text-2xl mb-4">Add Product</h2>
                {error && <p className="text-red-500 mb-2"> {error} </p>}
                <input
                    type="text"
                    placeholder="Name"
                    className="w-full mb-3 p-2 border rounded"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name:e.target.value})}
                    required
                />
                <textarea 
                    placeholder='description'
                    className='w-full mb-3 p-2 border rounded'
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value})}
                    required
                />
                <input
                    type='number'
                    step="0.01"
                    placeholder='Price'
                    className='w-full mb-3 p-2 border rounded'
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value})}
                    required
                />
                <label className='flex items-center mb-3'>
                    <input
                        type='checkbox'
                        checked={formData.available}
                        onChange={(e) => setFormData({ ... formData, available: e.target.checked})}
                        className="mr-2"
                    />
                    Available in stock?
                </label>
                <button
                    type='submit'
                    className='w-full bg-green-500 text-white p-2 rounded hover:bg-green-600'
                >
                    Save Product
                </button>
            </form>

            <button
                onClick={handleShowProducts}
                className='mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600'>
                    Show Products
            </button>
        </div>
    );
}