import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import AdminappTemplate from './AdminappTemplate';
import "./AdminAddServices.css";

const AdminAddServices = () => {
  const [serviceCategories, setServiceCategories] = useState([]);
  const [serviceSubcategories, setServiceSubcategories] = useState([]);

  const fetchServiceCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3001/admin/servicecategories');
      setServiceCategories(response.data);
    } catch (error) {
      console.error('Error fetching service categories:', error);
    }
  };

  const fetchServiceSubcategories = async (categoryId) => {
    try {
      const response = await axios.get(`http://localhost:3001/admin/servicesubcategories/${categoryId}`);
      setServiceSubcategories(response.data);
    } catch (error) {
      console.error('Error fetching service subcategories:', error);
    }
  };

  useEffect(() => {
    fetchServiceCategories();
  }, []);

  const categoryFormik = useFormik({
    initialValues: {
      categoryname: '',
      description: '',
    },
    validationSchema: Yup.object({
      categoryname: Yup.string().required('Category name is required'),
      description: Yup.string().required('Description is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.post('http://localhost:3001/admin/addservicecategory', values);
        alert('Service category added successfully!');
        resetForm();
        fetchServiceCategories(); // Fetch the updated list of categories
      } catch (error) {
        console.error('Error adding service category:', error);
      }
    },
  });

  const subcategoryFormik = useFormik({
    initialValues: {
      servicecategory_id: '',
      subcategoryname: '',
      description: '',
    },
    validationSchema: Yup.object({
      servicecategory_id: Yup.string().required('Service category is required'),
      subcategoryname: Yup.string().required('Subcategory name is required'),
      description: Yup.string().required('Description is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.post('http://localhost:3001/admin/addservicesubcategory', values);
        alert('Service subcategory added successfully!');
        resetForm();
        fetchServiceSubcategories(values.servicecategory_id); // Fetch the updated list of subcategories for the selected category
      } catch (error) {
        console.error('Error adding service subcategory:', error);
      }
    },
  });

  const serviceFormik = useFormik({
    initialValues: {
      title: '',
      description: '',
      price: '',
      duration: '',
      image: null,
      serviceCategory: '',
      serviceSubcategory: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
      price: Yup.number().required('Price is required'),
      duration: Yup.number().required('Duration is required'),
      image: Yup.mixed().required('Image is required'),
      serviceCategory: Yup.string().required('Service category is required'),
      serviceSubcategory: Yup.string().required('Service subcategory is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('price', values.price);
        formData.append('duration', values.duration);
        formData.append('image', values.image);
        formData.append('servicesubcategory_id', values.serviceSubcategory);

        await axios.post('http://localhost:3001/admin/addservice', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        alert('Service added successfully!');
        resetForm();
      } catch (error) {
        console.error('Error adding service:', error);
      }
    },
  });

  useEffect(() => {
    if (serviceFormik.values.serviceCategory) {
      fetchServiceSubcategories(serviceFormik.values.serviceCategory);
    } else {
      setServiceSubcategories([]);
    }
  }, [serviceFormik.values.serviceCategory]);

  return (
    <div>
      <AdminappTemplate />
      <div className='form'>

      <div>
        <h1>Add Service Category</h1>
        <form onSubmit={categoryFormik.handleSubmit}>
          <label htmlFor="categoryname">Category Name:</label>
          <input id="categoryname" type="text" {...categoryFormik.getFieldProps('categoryname')} />
          {categoryFormik.touched.categoryname && categoryFormik.errors.categoryname ? (
            <div>{categoryFormik.errors.categoryname}</div>
          ) : null}

          <label htmlFor="description">Description:</label>
          <input id="description" type="text" {...categoryFormik.getFieldProps('description')} />
          {categoryFormik.touched.description && categoryFormik.errors.description ? (
            <div>{categoryFormik.errors.description}</div>
          ) : null}

          <button type="button" onClick={categoryFormik.handleReset}>Cancel</button>
          <button type="submit">Submit</button>
        </form>
      </div>

      <div>
        <h1>Add Service Subcategory</h1>
        <form onSubmit={subcategoryFormik.handleSubmit}>
          <label htmlFor="servicecategory_id">Service Category:</label>
          <select
            id="servicecategory_id"
            {...subcategoryFormik.getFieldProps('servicecategory_id')}
          >
            <option value="">Select a category</option>
            {serviceCategories.map(category => (
              <option key={category.servicecategory_id} value={category.servicecategory_id}>
                {category.categoryname}
              </option>
            ))}
          </select>
          {subcategoryFormik.touched.servicecategory_id && subcategoryFormik.errors.servicecategory_id ? (
            <div>{subcategoryFormik.errors.servicecategory_id}</div>
          ) : null}

          <label htmlFor="subcategoryname">Subcategory Name:</label>
          <input id="subcategoryname" type="text" {...subcategoryFormik.getFieldProps('subcategoryname')} />
          {subcategoryFormik.touched.subcategoryname && subcategoryFormik.errors.subcategoryname ? (
            <div>{subcategoryFormik.errors.subcategoryname}</div>
          ) : null}

          <label htmlFor="description">Description:</label>
          <input id="description" type="text" {...subcategoryFormik.getFieldProps('description')} />
          {subcategoryFormik.touched.description && subcategoryFormik.errors.description ? (
            <div>{subcategoryFormik.errors.description}</div>
          ) : null}

          <button type="button" onClick={subcategoryFormik.handleReset}>Cancel</button>
          <button type="submit">Submit</button>
        </form>
      </div>

      <div>
        <h1>Add Service</h1>
        <form onSubmit={serviceFormik.handleSubmit}>
          <label htmlFor="title">Title:</label>
          <input id="title" type="text" {...serviceFormik.getFieldProps('title')} />
          {serviceFormik.touched.title && serviceFormik.errors.title ? (
            <div>{serviceFormik.errors.title}</div>
          ) : null}

          <label htmlFor="description">Description:</label>
          <input id="description" type="text" {...serviceFormik.getFieldProps('description')} />
          {serviceFormik.touched.description && serviceFormik.errors.description ? (
            <div>{serviceFormik.errors.description}</div>
          ) : null}

          <label htmlFor="price">Price:</label>
          <input id="price" type="number" {...serviceFormik.getFieldProps('price')} />
          {serviceFormik.touched.price && serviceFormik.errors.price ? (
            <div>{serviceFormik.errors.price}</div>
          ) : null}

          <label htmlFor="duration">Duration (Minutes):</label>
          <input id="duration" type="number" {...serviceFormik.getFieldProps('duration')} />
          {serviceFormik.touched.duration && serviceFormik.errors.duration ? (
            <div>{serviceFormik.errors.duration}</div>
          ) : null}

          <label htmlFor="image">Image:</label>
          <input id="image" type="file" onChange={(event) => serviceFormik.setFieldValue('image', event.target.files[0])} />
          {serviceFormik.touched.image && serviceFormik.errors.image ? (
            <div>{serviceFormik.errors.image}</div>
          ) : null}

          <label htmlFor="serviceCategory">Service Category:</label>
          <select
            id="serviceCategory"
            {...serviceFormik.getFieldProps('serviceCategory')}
            onChange={(event) => {
              serviceFormik.setFieldValue('serviceCategory', event.target.value);
              serviceFormik.setFieldValue('serviceSubcategory', ''); // Reset subcategory when category changes
              fetchServiceSubcategories(event.target.value); // Fetch subcategories for the selected category
            }}
          >
            <option value="">Select a category</option>
            {serviceCategories.map(category => (
              <option key={category.servicecategory_id} value={category.servicecategory_id}>
                {category.categoryname}
              </option>
            ))}
          </select>
          {serviceFormik.touched.serviceCategory && serviceFormik.errors.serviceCategory ? (
            <div>{serviceFormik.errors.serviceCategory}</div>
          ) : null}

          <label htmlFor="serviceSubcategory">Service Subcategory:</label>
          <select id="serviceSubcategory" {...serviceFormik.getFieldProps('serviceSubcategory')}>
            <option value="">Select a subcategory</option>
            {serviceSubcategories.map(subcategory => (
              <option key={subcategory.servicesubcategory_id} value={subcategory.servicesubcategory_id}>
                {subcategory.subcategoryname}
              </option>
            ))}
          </select>
          {serviceFormik.touched.serviceSubcategory && serviceFormik.errors.serviceSubcategory ? (
            <div>{serviceFormik.errors.serviceSubcategory}</div>
          ) : null}

          <button type="button" onClick={serviceFormik.handleReset}>Cancel</button>
          <button type="submit">Submit</button>
        </form>
      </div>
      </div>
    </div>
  );
}

export default AdminAddServices;
