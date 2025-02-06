import { useEffect, useState } from 'react';  
import axios from 'axios';  
import { useRouter } from 'next/router';


export default function ShowProducts() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    useEffect(() =>{
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:8000/api/products', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("API response: ", res.data);
                setProducts(res.data.products || res.data);
            } catch (err){
                console.error('Failed to show products: ' , err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return(
        <div className='min-h-screen p-8 bg-gray-100'>
            <h1 className='text-2xl mb-4'>All products</h1>
            {loading ? (
                <p>Loading products...</p>
            ) : (
            <table className='w-full bg-white rounded shadow-md'>
                <thead>
                    <tr className='border-b'>
                        <th className='p-2'>Name</th>
                        <th className='p-2'>Description</th>
                        <th className='p-2'>Price</th>
                        <th className='p-2'>Available</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id} className='border-b'>
                            <td className='p-2'>{product.name}</td>
                            <td className='p-2'>{product.description}</td>
                            <td className='p-2'>{product.price}</td>
                            <td className='p-2'>{product.available ? 'Yes' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
            <button onClick={handleGoBack}>Go back</button>
        </div>
    );
}