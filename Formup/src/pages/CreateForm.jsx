import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from 'lucide-react';
import { createForm } from '../services/api';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import FormField from '../components/molecules/FormField';

const CreateForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    fields: []
  });

  const createFormMutation = useMutation({
    mutationFn: createForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      navigate('/');
    },
    onError: (error) => {
      console.error('Error creating form:', error);
    }
  });

  const addField = () => {
    const newField = {
      id: Date.now().toString(),
      type: 'text',
      label: '',
      required: false,
      options: []
    };
    setForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (fieldId, updates) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const removeField = (fieldId) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.title && form.fields.length > 0) {
      createFormMutation.mutate(form);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 ">
          Create New Form
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Build your custom form with various field types
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Form Title"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter form title"
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Form Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter form description (optional)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 ">
                Form Fields
              </h3>
              <Button
                type="button"
                variant="outline"
                onClick={addField}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>

            {form.fields.length > 0 ? (
              <div className="space-y-4">
                {form.fields.map((field) => (
                  <FormField
                    key={field.id}
                    field={field}
                    onUpdate={updateField}
                    onRemove={removeField}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No fields added yet. Click "Add Field" to start building your form.
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={createFormMutation.isLoading}
              disabled={!form.title || form.fields.length === 0}
            >
              Create Form
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateForm;
