import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { getForms, deleteForm } from '../services/api';
import Button from '../components/atoms/Button';
import Loading from '../components/atoms/Loading';
import FormCard from '../components/molecules/FormCard';
import ConfirmDialog from '../components/organisms/ConfirmDialog';


const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-md border disabled:opacity-50"
      >
        Previous
      </button>
      <span className="px-4 py-2">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-md border disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['forms', currentPage],
    queryFn: () => getForms(currentPage),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteForm,
    onSuccess: (_, formId) => {
      queryClient.invalidateQueries(['forms']);
    },
    onError: (err) => {
      console.error('Error deleting form:', err);
    },
  });

  const confirmDelete = (formId) => {
    setSelectedFormId(formId);
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (selectedFormId) {
      deleteMutation.mutate(selectedFormId);
      setIsConfirmOpen(false);
      setSelectedFormId(null);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Forms</h1>
          <p className="text-gray-600 mt-2">Create and manage your forms</p>
        </div>
        <Link to="/create">
          <Button size="lg" variant="primary" aria-label="Create new form">
            <Plus className="h-5 w-5 mr-2" />
            Create Form
          </Button>
        </Link>
      </div>

      {data?.forms?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.forms.map((form) => (
              <FormCard
                key={form._id}
                form={form}
                onDelete={() => confirmDelete(form._id)}
              />
            ))}
          </div>
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={data.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">No forms yet</h2>
          <p className="text-gray-600 mb-6">Get started by creating your first form</p>
          <Link to="/create">
            <Button size="lg" variant="outline">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Form
            </Button>
          </Link>
        </div>
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        title="Delete Form"
        description="Are you sure you want to delete this form? This action cannot be undone."
      />
    </div>
  );
};

export default Dashboard;