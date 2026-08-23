import React, { useRef } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { addFlashcard } from '../redux/flashcardSlice';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiEdit2, FiUploadCloud } from 'react-icons/fi';

const validationSchema = Yup.object().shape({
  groupName: Yup.string().required('Group Name is required'),
  description: Yup.string().required('Description is required'),
  terms: Yup.array().of(
    Yup.object().shape({
      termName: Yup.string().required('Term Name is required'),
      definition: Yup.string().required('Definition is required'),
      termImage: Yup.string(),
    })
  ),
});

const CreateFlashcard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const groupImageRef = useRef(null);

  const initialValues = {
    groupName: '',
    description: '',
    groupImage: '',
    terms: [
      { termName: '', definition: '', termImage: '' },
    ],
  };

  const handleFileUpload = (e, setFieldValue, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFieldValue(fieldName, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (values, { resetForm }) => {
    const newGroup = {
      id: Date.now().toString(),
      ...values,
    };
    dispatch(addFlashcard(newGroup));
    resetForm();
    navigate('/my-flashcards');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Create Flashcard</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-6">
            {/* Top Box: Group Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  Create Group*
                </label>
                <div className="flex items-center gap-4">
                  <Field
                    type="text"
                    name="groupName"
                    placeholder="Enter Group Name"
                    className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                  />
                  <div>
                    <input
                      type="file"
                      ref={groupImageRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setFieldValue, 'groupImage')}
                    />
                    <button
                      type="button"
                      onClick={() => groupImageRef.current.click()}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-blue-500 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                    >
                      <FiUploadCloud /> Upload Image
                    </button>
                  </div>
                </div>
                <ErrorMessage name="groupName" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {values.groupImage && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                  <img src={values.groupImage} alt="Group Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFieldValue('groupImage', '')}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  Add description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  rows="3"
                  placeholder="Describe the roles, responsibility, skills required for the job and help candidate understand the role better."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
              </div>
            </div>

            {/* Bottom Box: Terms FieldArray */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <FieldArray name="terms">
                {({ push, remove }) => (
                  <div className="space-y-6">
                    {values.terms.map((term, index) => {
                      const fileInputId = `termImage-${index}`;
                      return (
                        <div 
                          key={index} 
                          className="flex items-start gap-4 pb-6 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          {/* Number Badge */}
                          <div className="w-8 h-8 rounded-full bg-red-500 text-white font-semibold flex items-center justify-center shrink-0 mt-6">
                            {index + 1}
                          </div>

                          {/* Term Fields Grid */}
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                            
                            {/* Term Name (4 columns) */}
                            <div className="md:col-span-4">
                              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                                Enter Term*
                              </label>
                              <Field
                                type="text"
                                name={`terms.${index}.termName`}
                                placeholder="Enter Term Name"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                              />
                              <ErrorMessage name={`terms.${index}.termName`} component="div" className="text-red-500 text-xs mt-1" />
                            </div>

                            {/* Definition - Big Box (5 columns) */}
                            <div className="md:col-span-5">
                              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                                Enter Definition*
                              </label>
                              <Field
                                as="textarea"
                                rows="4"
                                name={`terms.${index}.definition`}
                                placeholder="Enter detailed definition or explanation..."
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none leading-relaxed"
                              />
                              <ErrorMessage name={`terms.${index}.definition`} component="div" className="text-red-500 text-xs mt-1" />
                            </div>

                            {/* Select Image & Actions (3 columns) */}
                            <div className="md:col-span-3 flex items-start gap-2 pt-6">
                              <input
                                type="file"
                                id={fileInputId}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, setFieldValue, `terms.${index}.termImage`)}
                              />

                              {term.termImage ? (
                                <div className="relative w-28 h-20 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 shrink-0">
                                  <img src={term.termImage} alt="Term preview" className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <label
                                  htmlFor={fileInputId}
                                  className="cursor-pointer px-4 py-2.5 text-sm font-medium border border-blue-500 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition shrink-0 whitespace-nowrap"
                                >
                                  Select Image
                                </label>
                              )}

                              <div className="flex flex-col gap-1">
                                {term.termImage && (
                                  <label htmlFor={fileInputId} className="cursor-pointer text-blue-500 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition">
                                    <FiEdit2 />
                                  </label>
                                )}

                                {values.terms.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="text-gray-400 hover:text-red-500 p-2 transition rounded"
                                  >
                                    <FiTrash2 />
                                  </button>
                                )}
                              </div>
                            </div>

                          </div>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => push({ termName: '', definition: '', termImage: '' })}
                      className="text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline inline-flex items-center gap-1"
                    >
                      + Add more
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-14 py-3 rounded-lg shadow-md transition"
              >
                Create
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateFlashcard;
