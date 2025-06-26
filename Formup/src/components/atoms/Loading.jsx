const Loading = () => {
  return (
    <div
      className="flex items-center justify-center py-12"
      role="status"
      aria-label="Loading"
    >
      <div
        className="h-12 w-12 border-2 border-primary-200 border-b-primary-700 rounded-full animate-spin"
      ></div>
    </div>
  );
};

export default Loading;
