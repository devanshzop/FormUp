import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from "@tanstack/react-query";
import { getForm, submitResponse } from '../services/api';
import Button from '../components/atoms/Button';
import Loading from '../components/atoms/Loading';

const FillForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const { data: form, isLoading, error } = useQuery({
    queryKey: ['form', id],
    queryFn: () => getForm(id),
  });

  const submitMutation = useMutation({
    mutationFn: (responseData) => submitResponse(id, responseData),
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (error) => {
      console.error('Error submitting response:', error);
    }
  });

  const handleInputChange = (fieldId, value) => {
    setResponses(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = form.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !responses[field._id]);

    if (missingFields.length > 0) {
      alert('Please fill in all required fields');
      return;
    }

    submitMutation.mutate({ responses });
  };

  const renderField = (field) => {
    const value = responses[field._id] || '';

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field._id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300  rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required={field.required}
          />
        );

      // case 'paragraph':
      //   return (
      //     <textarea
      //       value={value}
      //       onChange={(e) => handleInputChange(field._id, e.target.value)}
      //       rows={4}
      //       className="w-full px-3 py-2 border border-gray-300  rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 "
      //       required={field.required}
      //     />
      //   );

      case 'options':
        return (
          <div className="space-y-2">
            {field.options.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name={field._id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(field._id, e.target.value)}
                  className="mr-2"
                  required={field.required}
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    if (e.target.checked) {
                      handleInputChange(field._id, [...currentValues, option]);
                    } else {
                      handleInputChange(field._id, currentValues.filter(v => v !== option));
                    }
                  }}
                  className="mr-2"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 ">
          Error loading form. Please try again.
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-green-50  border border-green-200  rounded-lg p-8">
          <h2 className="text-2xl font-bold text-green-800  mb-4">
            Thank You!
          </h2>
          <p className="text-green-700  mb-6">
            Your response has been submitted successfully.
          </p>
          <Button onClick={() => navigate('/')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white  rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {form.title}
          </h1>
          {form.description && (
            <p className="text-gray-600 ">
              {form.description}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {form.fields.map((field) => (
            <div key={field._id}>
              <label className="block text-sm font-medium text-gray-700  mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}

          <div className="pt-6 border-t border-gray-200">
            <Button
              type="submit"
              loading={submitMutation.isLoading}
              className="w-full"
            >
              Submit Response
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FillForm;
