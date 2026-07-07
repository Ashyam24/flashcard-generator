import React, { useRef } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { addFlashcard } from '../redux/flashcardSlice';
import { MdUploadFile, MdDelete, MdEdit } from 'react-icons/md';

const FlashcardSchema = Yup.object().shape({
  groupName: Yup.string().required('Group Name is required'),
  description: Yup.string().required('Description is required'),
  groupImage: Yup.string().optional(),
  terms: Yup.array().of(
    Yup.object().shape({
      termName: Yup.string().required('Term Name is required'),
      definition: Yup.string().required('Definition is required'),
    })
  ).min(1, 'Must have at least one flashcard term'),
});

export default function CreateFlashcard() {
  const dispatch = useDispatch();
  const termInputRefs = useRef([]);

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-6">Create Flashcard</h2>
      
      <Formik
        initialValues={{
          groupName: '',
          description: '',
          groupImage: '',
          terms: [{ termName: '', definition: '' }],
        }}
        validationSchema={FlashcardSchema}
        onSubmit={(values, { resetForm }) => {
          const newGroup = {
            id: Date.now().toString(),
            ...values,
          };
          dispatch(addFlashcard(newGroup));
          alert('Flashcard group created successfully!');
          resetForm();
        }}
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-6">
            
            {/* TOP CONTAINER: GROUP DETAILS */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-5">
              
              {/* 1. Group Name Input Line */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Create Group*
                </label>
                <Field
                  name="groupName"
                  placeholder="Enter Group Name"
                  className="w-full max-w-lg px-4 py-2.5 text-sm bg-gray-50/50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:border-red-500 dark:focus:border-red-500 transition-all"
                />
                <ErrorMessage name="groupName" component="div" className="text-red-500 text-xs mt-1 font-semibold" />
              </div>

              {/* 2. Brand New Stacked Upload Section Block */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Upload Group Image (Optional)
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 cursor-pointer bg-gray-50/50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:border-red-500 dark:hover:border-red-500 transition-all text-xs font-bold uppercase tracking-wider">
                    <MdUploadFile size={18} className="text-gray-400" />
                    <span>{values.groupImage ? 'Change Image' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.currentTarget.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFieldValue('groupImage', reader.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>

                  {/* Real-time Visual thumbnail render output check wrapper */}
                  {values.groupImage && (
                    <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-900 pl-2 pr-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800">
                      <div className="h-9 w-9 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <img src={values.groupImage} alt="Preview" className="h-full w-full object-cover" />
                      </div>
                      <span className="text-xs text-gray-400 font-medium">image_loaded.png</span>
                      <button 
                        type="button" 
                        onClick={() => setFieldValue('groupImage', '')}
                        className="text-gray-400 hover:text-red-500 text-xs font-bold pl-1"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Description Field Line */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Add Description*
                </label>
                <Field
                  as="textarea"
                  name="description"
                  rows="3"
                  placeholder="Describe your flashcard group..."
                  className="w-full px-4 py-2.5 text-sm bg-gray-50/50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:border-red-500 dark:focus:border-red-500 transition-all resize-none"
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1 font-semibold" />
              </div>
            </div>

            {/* BOTTOM CONTAINER: DYNAMIC FLASHCARD TERMS LIST */}
            <FieldArray name="terms">
              {({ push, remove }) => (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
                  {values.terms.map((term, index) => (
                    <div key={index} className="relative border-b border-gray-50 dark:border-gray-700 pb-6 last:border-none last:pb-0">
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                          {index + 1}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => termInputRefs.current[index]?.focus()}
                            className="text-gray-400 hover:text-blue-500 transition p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            title="Edit Term Field"
                          >
                            <MdEdit size={16} />
                          </button>
                          
                          {values.terms.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-gray-400 hover:text-red-500 transition p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                              title="Delete Term"
                            >
                              <MdDelete size={16} />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Field
                            innerRef={(el) => (termInputRefs.current[index] = el)}
                            name={`terms.${index}.termName`}
                            placeholder="Enter Term*"
                            className="w-full px-4 py-2.5 text-sm bg-gray-50/50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:border-red-500 dark:focus:border-red-500 transition-all"
                          />
                          <ErrorMessage name={`terms.${index}.termName`} component="div" className="text-red-500 text-xs mt-1 font-semibold" />
                        </div>
                        
                        <div>
                          <Field
                            name={`terms.${index}.definition`}
                            placeholder="Enter Definition*"
                            className="w-full px-4 py-2.5 text-sm bg-gray-50/50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:border-red-500 dark:focus:border-red-500 transition-all"
                          />
                          <ErrorMessage name={`terms.${index}.definition`} component="div" className="text-red-500 text-xs mt-1 font-semibold" />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => push({ termName: '', definition: '' })}
                    className="text-red-500 hover:text-red-600 font-bold text-sm tracking-wide transition flex items-center space-x-1 mt-2"
                  >
                    <span>+ Add More Term</span>
                  </button>
                </div>
              )}
            </FieldArray>

            {/* ACTION SUBMIT BUTTON */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full md:w-56 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl shadow-md shadow-red-200 dark:shadow-none transition-all duration-200 text-sm tracking-wide"
              >
                Save Flashcard
              </button>
            </div>

          </Form>
        )}
      </Formik>
    </div>
  );
}