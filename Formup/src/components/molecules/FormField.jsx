import { Trash2 } from 'lucide-react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'

const FormField = ({ field, onUpdate, onRemove }) => {

  const handleInputChange = (key, value) => {
    onUpdate(field.id, { [key]: value });
  };

  const addOption = () => {
    const newOptions = [...(field.options || []), ''];
    onUpdate(field.id, { options: newOptions });
  };

  const updateOption = (index, value) => {
    const newOptions = [...field.options];
    newOptions[index] = value;
    onUpdate(field.id, { options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = field.options.filter((_, i) => i !== index);
    onUpdate(field.id, { options: newOptions });
  };

  const OPTIONS = [
  { label: 'Text', value: 'text' },
  { label: 'Multiple Choice', value: 'options' },
  { label: 'Checkboxes', value: 'checkbox' }
];
  const selected = OPTIONS.find(opt => opt.value === field.type)?.label || 'Select';
  return (
    <div className="p-4 border border-gray-200  rounded-lg bg-gray-50  space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>

              <label className="block text-sm font-medium text-gray-700  mb-2">
                Field Type
              </label>


              {/* <div className="relative">
  <select
    value={field.type}
    onChange={(e) => handleInputChange('type', e.target.value)}
    className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
  >
    <option value="text">Text</option>
    <option value="options">Multiple Choice</option>
    <option value="checkbox">Checkboxes</option>
  </select>

  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  </div>
</div> */}

   <div className="relative">
             <Menu>
        <MenuButton className="inline-flex justify-between w-full items-center gap-2 rounded-md bg-white px-3 border border-gray-300  py-2 text-sm  text-black  focus:outline-none ">
          {selected}
          <ChevronDownIcon className="w-4 h-4" />
        </MenuButton>

        <MenuItems className="absolute z-10 mt-2 w-full rounded-md bg-white text-black  shadow-lg ring-1  ">
          {OPTIONS.map(option => (
            <MenuItem key={option.value}>
              {({ active }) => (
                <button
                  type="button"
                  className={`w-full text-left px-4 py-2  ${
                    active ? 'bg-white/10 hover:bg-gray-200 rounded-md' : ''
                  }`}
                  onClick={() => handleInputChange('type', option.value)}
                >
                  {option.label}
                </button>
              )}
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>
      </div>

            </div>

            <div className="flex items-center pt-6">
              <input
                type="checkbox"
                id={`required-${field.id}`}
                checked={field.required || false}
                onChange={(e) => handleInputChange('required', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor={`required-${field.id}`} className="ml-2 text-sm text-gray-700 ">
                Required field
              </label>
            </div>
          </div>

          <Input
            label="Question/Label"
            value={field.label || ''}
            onChange={(e) => handleInputChange('label', e.target.value)}
            placeholder="Enter your question"
          />

          {(field.type === 'options' || field.type === 'checkbox') && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 ">
                Options
              </label>
              {field.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 "
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(index)}
                    aria-label={`Remove option ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
              >
                Add Option
              </Button>
            </div>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(field.id)}
          className="text-red-600 hover:text-red-700 ml-4"
          aria-label="Remove field"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};


export default FormField;