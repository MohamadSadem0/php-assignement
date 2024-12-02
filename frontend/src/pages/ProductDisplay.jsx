import axios from 'axios';
import { useEffect, useState } from 'react';
import ProductCard from '../components/cards/ProductCard';

function ProductDisplay() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          'http://localhost/assignements/php-assignement-test/action/fetch-products.php',
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          setError('Failed to fetch product: ' + response.data.error);
        }
      } catch (error) {
        setError('Error fetching product: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  const handleEdit = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  if (loading)
    return <div className="text-center mt-10">Loading product...</div>;
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="flex flex-wrap gap-6 pt-6 pb-6 justify-center items-center">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard
            id={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            imageUrl={product.image_path}
            onEdit={handleEdit}
          />
        ))
      ) : (
        <div className="text-center mt-10 text-gray-400">No products found</div>
      )}
    </div>
  );
}

export default ProductDisplay;
