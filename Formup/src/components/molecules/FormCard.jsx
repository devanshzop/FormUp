import { Link } from 'react-router-dom';
import { Eye, BarChart3, Trash2, Calendar } from 'lucide-react';
import Button from '../atoms/Button';

const FormCard = ({ form, onDelete }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white  rounded-lg shadow-sm border border-gray-200  p-6 hover:shadow-md transition-shadow">
      <div className=" grid mb-4">

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {form.title}
          </h3>
          {form.description && (
            <p className="text-gray-600 text-sm mb-3">
              {form.description}
            </p>
          ) ||<p className="text-gray-600 text-sm mb-3">
           &nbsp;
            </p>}
          <div className="flex items-center text-sm text-gray-500 ">
            <Calendar className="h-4 w-4 mr-1" />
            Created {formatDate(form.createdAt)}
          </div>
</div>
          
        
           <div className="flex flex-row py-5 lg:flex-wrap items-center space-x-2">
          <Link to={`/form/${form._id}`}>
            <Button size="sm" aria-label="View form">
              <Eye className="h-4 w-4 mr-1 sm:w-auto " />
              View
            </Button>
          </Link>
          
          <Link to={`/responses/${form._id}`}>
            <Button variant="outline" size="sm" aria-label="View responses">
              <BarChart3 className="h-4 w-4 mr-1 sm:w-auto" />
              Responses 
              {/* ({form.responseCount || 0}) */}
            </Button>
          </Link>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(form._id)}
            className="text-primary-600 hover:text-red-700 sm:w-auto"
            aria-label="Delete form"
          >
            <Trash2 className="h-4 w-4 " />
          </Button>
        </div>
              </div>

 
        
     
      
    </div>
  );
};


export default FormCard;