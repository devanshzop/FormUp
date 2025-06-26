import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';


const ConfirmDialog = ({ isOpen, onClose, onConfirm, title = 'Confirm Action', description = 'Are you sure you want to continue?' }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} as="div" className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6">
          <DialogTitle className="text-lg font-semibold text-gray-900">{title}</DialogTitle>
          <p className="mt-2 text-gray-600">{description}</p>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;
