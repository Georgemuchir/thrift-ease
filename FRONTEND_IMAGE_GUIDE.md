# Frontend Integration Guide: Product Image Upload & Display

This guide explains how to connect your React frontend to the Flask backend for uploading and displaying product images.

---

## 1. Add Product with Image Upload

- Use a `FormData` object to send `name`, `price`, and the image file to the backend:

```js
const data = new FormData();
data.append("name", formData.name);
data.append("price", formData.price);
data.append("image", formData.image);

await axios.post("http://localhost:5000/api/products", data);
```

---

## 2. Display Product Images

- When fetching products, each product will have an `image` or `image_url` field, e.g.:
  - `http://localhost:5000/uploads/filename.png`
- Use this field as the `src` in your `<img>` tag:

```jsx
<img src={product.image} alt="Product" />
```

---

## 3. Fallback for Broken Images

- Add a fallback in case the image fails to load:

```jsx
<img
  src={product.image}
  alt="Product"
  onError={e => { e.target.onerror = null; e.target.src = "/placeholder.png"; }}
/>
```

---

## 4. Debugging Tips

- If an image does not show, right-click the broken image, open in new tab, and check the URL and HTTP status (should be 200, not 404).
- Use the browser network tab to inspect requests and responses.

---

## Summary

- Use the `image` or `image_url` field from the backend as the image `src`.
- Always send product data as `FormData` when uploading an image.
- Use a fallback image for broken links.
- If you see a broken image, check the actual URL in the browser.

---

If you need further help, contact the backend developer or check the backend API documentation.
