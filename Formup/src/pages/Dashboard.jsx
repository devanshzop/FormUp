
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { getForms, deleteForm } from '../services/api';
import Button from '../components/atoms/Button';
import Loading from '../components/atoms/Loading';
import FormCard from '../components/molecules/FormCard';
import ConfirmDialog from '../components/organisms/ConfirmDialog';

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [forms, setForms] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchForms = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await getForms(pageNumber);
      if (Array.isArray(res.forms)) {
        setForms((prev) => {
          const existingIds = new Set(prev.map((f) => f._id));
          const newForms = res.forms.filter((f) => !existingIds.has(f._id));
          return [...prev, ...newForms];
        });
        setHasMore(res.hasMore);
      } else {
        console.error('Unexpected response format:', res);
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching forms:', err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchForms(page);
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.scrollHeight * 0.8 &&
        !loading &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  
  const deleteMutation = useMutation({
    mutationFn: deleteForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      setForms((prev) => prev.filter((f) => f._id !== selectedFormId));
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

      {initialLoading ? (
        <Loading />
      ) : forms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <FormCard
              key={form._id}
              form={form}
              onDelete={() => confirmDelete(form._id)}
            />
          ))}
        </div>
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

      {loading && !initialLoading && (
        <div className="text-center mt-4">
          <Loading />
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
