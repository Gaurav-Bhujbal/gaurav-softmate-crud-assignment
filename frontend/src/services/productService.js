import api from '../api/axios';

export function getProducts(page, search) {
  return api.get('/products', { params: { page, search } });
}

export function getProductById(id) {
  return api.get('/products/' + id);
}

export function createProduct(data) {
  return api.post('/products', data);
}

export function updateProduct(id, data) {
  return api.put('/products/' + id, data);
}

export function deleteProduct(id) {
  return api.delete('/products/' + id);
}
