
function eliminarProducto(productId) {
    fetch(`http://localhost:3200/producto/${productId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo eliminar el producto');
        }
        return response.json();
    })
    .then(data => {
        alert('Producto eliminado exitosamente');
    })
    .catch(error => {
        console.error('Error al eliminar el producto:', error);
    });
}
