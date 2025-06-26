import { createContext, useContext, useState } from 'react';


const FormContext = createContext();

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};

export const FormProvider = ({ children }) => {
  const [currentForm, setCurrentForm] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fields: []
  });

  const addField = (field) => {
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, { ...field, id: Date.now().toString() }]
    }));
  };

  const removeField = (fieldId) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  const updateField = (fieldId, updates) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      fields: []
    });
  };

  return (
    <FormContext.Provider value={{
      currentForm,
      setCurrentForm,
      formData,
      setFormData,
      addField,
      removeField,
      updateField,
      resetForm
    }}>
      {children}
    </FormContext.Provider>
  );
};

