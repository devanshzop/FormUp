import { useParams } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { getForm, getResponses } from '../services/api';
import Loading from '../components/atoms/Loading';

const ViewResponses = () => {
  const { id } = useParams();

  const {
    data: form,
    isLoading: formLoading,
    error: formError
  } = useQuery({
    queryKey: ['form', id],
    queryFn: () => getForm(id),
  }); 

  const {
    data: responses,
    isLoading: responsesLoading,
    error: responsesError
  } = useQuery({
    queryKey: ['responses', id],
    queryFn: () => getResponses(id),
  });

  const isLoading = formLoading || responsesLoading;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderFieldResponse = (field, response) => {
    const value = response.responses[field._id];

    if (!value || (Array.isArray(value) && value.length === 0)) {
      return <span className="text-gray-400">No response</span>;
    }

    return Array.isArray(value) ? value.join(', ') : value;
  };

  if (isLoading) return <Loading />;

  if (formError || responsesError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 ">
          Failed to load form or responses. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 ">
          {form?.title} - Response
        </h1>
        <p className="text-gray-600  mt-2">
          {responses?.length || 0} responses received
        </p>
      </div>

      {responses && responses.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 ">
              <thead className="bg-gray-50 ">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">
                    Submitted At
                  </th>
                  {form?.fields.map((field) => (
                    <th
                      key={field._id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {field.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 ">
                {responses.map((response) => (
                  <tr key={response._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                      {formatDate(response.submittedAt)}
                    </td>
                    {form?.fields.map((field) => (
                      <td
                        key={field._id}
                        className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate"
                      >
                        {renderFieldResponse(field, response)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            No responses yet
          </h2>
          <p className="text-gray-600 ">
            Share your form to start collecting responses
          </p>
        </div>
      )}
    </div>
  );
};

export default ViewResponses;
