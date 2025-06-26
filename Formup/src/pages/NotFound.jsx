import {useNavigate} from 'react-router-dom'

const NotFound = () => {
    const navigate = useNavigate();
  return (
    <div className=" flex h-full justify-center  mt-60 ">
      <div className="flex flex-col text-center  items-center">
        <h1 className="text-5xl font-bold text-primary-700">404</h1>
        <p className="mt-4 text-xl text-gray-700">Page Not Found</p>
        <button
          onClick ={() => navigate('/')}
          className="mt-6 inline-block bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition">
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
