import { useEffect, useState } from 'react';  
import axios from 'axios';  
import { useRouter } from 'next/router';


export default function ShowProducts() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState(null);

    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    const EditProductForm = ({product, onClose, onUpdate}) => {
        const [formData, setFormData] = useState({
            name: product.name,
            description: product.description,
            price: product.price,
            available: product.available,
        });

        const handleChange = (e) => {
            const {name, value, type, checked} = e.target;
            setFormData({
                ...formData, [name]:type === 'checkbox' ? checked : value,
            });
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            try{
                const token = localStorage.getItem('token');
                const response = await axios.put(`http://localhost:8000/api/products/${product.id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Update response: ', response);
                alert('Product updated successfully!');
                onUpdate();
                onClose();
            } catch (error){
                console.error('Error updating the product: ', error);
                alert('Failed updating the product. Try again.');
            }
        };

        return (
            <div style={{position: 'fixed', top:'20%', left:'50%', transform: 'translateX(-50%)', background: 'white', padding: '20px', 
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>
                <h2 className='text-xl mb-4'>Edit Product</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='block mb-1'>Name:</label>
                        <input
                            type='text'
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            className='w-full p-2 border rounded'
                            required/>
                    </div>
                    <div className='mb-4'>
                        <label className='block mb-1'>Description:</label>
                        <textarea
                            name='description'
                            value={formData.description}
                            onChange={handleChange}
                            className='w-full p-2 border rounded'/>
                    </div>
                    <div className='mb-4'>
                        <label className='block mb-1'>Price:</label>
                        <input
                            type='number'
                            name='price'
                            value={formData.price}
                            onChange={handleChange}
                            className='w-full p-2 border rounded'
                            required/>
                    </div>
                    <div className='mb-4'>
                        <label className='block mb-1'>Available:</label>
                        <input
                            type='checkbox'
                            name='available'
                            checked={formData.available}
                            onChange={handleChange}
                            className='ml-2'/>
                    </div>
                    <button type='submit' className='bg-green-500 text-white px-4 py-2 rounded mr-2'>Save Changes</button>
                    <button type='button' onClick={onClose} className='bg-gray-500 text-white px-4 py-2 rounded'>Cancel</button>
                </form>
            </div>
        );
    };

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

    useEffect(() =>{
        fetchProducts();
    }, []);

    const handleUpdate = () => {
        console.log('Refreshing product list... ')
        fetchProducts();
    }


    return(
        <div className='min-h-screen p-8 bg-gray-100'>
            <h1 className='text-2xl mb-4'>All products</h1>
            {loading ? (
                <p>Loading products...</p>
            ) : (
            <table key={products.length} className='w-full bg-white rounded shadow-md'>
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
                            <td className='p-2'>
                                <button onClick={() => setSelectedProducts(product)}
                                    className='bg-blue-500 text-white px-2 py-1 rounded'>
                                        Edit
                                </button>
                            </td>                            
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
            {selectedProducts && (
                <EditProductForm product={selectedProducts}
                onClose={() => setSelectedProducts(null)}
                onUpdate={handleUpdate} />
                )}
            <button onClick={handleGoBack}>Go back</button>
        </div>
    );
}