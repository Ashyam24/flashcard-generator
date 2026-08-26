import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiUpload, FiTrash2, FiPlus, FiImage, FiEdit2 } from 'react-icons/fi';
import { addFlashcard, updateFlashcard } from '../redux/flashcardsSlice';

// Schema validation rules for group metadata and dynamic terms array
const FlashcardSchema = Yup.object().shape({
  groupName: Yup.string()
    .min(3, 'Group name must be at least 3 characters')
    .max(50, 'Group name must be under 50 characters')
    .required('Group name is required'),
  description: Yup.string()
    .max(300, 'Description cannot exceed 300 characters')
    .required('Description is required'),
  terms: Yup.array()
    .of(
      Yup.object().shape({
        termName: Yup.string().required('Term name is required'),
        definition: Yup.string()
          .min(5, 'Definition must be at least 5 characters')
          .required('Definition is required'),
        termImage: Yup.string().nullable(),
      })
    )
    .min(1, 'Please add at least one flashcard term'),
});

const CreateFlashcard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const groupImageInputRef = useRef(null);

  // Check if we are currently editing an existing deck
  const isEditMode = Boolean(id);
  const cards = useSelector((state) => state.flashcards.cards);
  const existingGroup = cards.find((c) => c.id === id);

  const [groupImage, setGroupImage] = useState(null);

  // Default empty form values for create mode
  const defaultInitialValues = {
    groupName: '',
    description: '',
    terms: [{ termName: '', definition: '', termImage: null }],
  };

  const [initialValues, setInitialValues] = useState(defaultInitialValues);

  // Re-hydrate form state when accessing /edit/:id
  useEffect(() => {
    if (isEditMode && existingGroup) {
      setInitialValues({
        groupName: existingGroup.groupName || '',
        description: existingGroup.description || '',
        terms: existingGroup.terms && existingGroup.terms.length > 0 
          ? existingGroup.terms 
          : [{ termName: '', definition: '', termImage: null }],
      });
      setGroupImage(existingGroup.groupImage || null);
    }
  }, [isEditMode, existingGroup]);

  // Convert uploaded image file into base64 string for persistent offline storage
  const handleImageUpload = (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reject files larger than 2MB to preserve localStorage limits
    if (file.size > 2 * 1024 * 1024) {
      alert('Please upload an image smaller than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (values, { resetForm }) => {
    if (isEditMode) {
      const updatedData = {
        ...existingGroup,
        groupName: values.groupName,
        description: values.description,
        groupImage: groupImage,
        terms: values.terms,
        updatedAt: new Date().toISOString(),
      };
      dispatch(updateFlashcard(updatedData));
      navigate(`/flashcard-details/${id}`);
    } else {
      const newFlashcard = {
        id: Date.now().toString(),
        groupName: values.groupName,
        description: values.description,
        groupImage: groupImage,
        terms: values.terms,
        createdAt: new Date().toISOString(),
      };
      dispatch(addFlashcard(newFlashcard));
      resetForm();
      setGroupImage(null);
      navigate('/my-flashcards');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {isEditMode ? 'Edit Flashcard Group' : 'Create New Flashcard'}
      </h1>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={FlashcardSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-6">
            {/* Top Card: Group Metadata */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Create Group*
                    </label>
                    <Field
                      name="groupName"
                      type="text"
                      placeholder="e.g., Computer Science Terms"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition"
                    />
                    <ErrorMessage name="groupName" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Add Description*
                    </label>
                    <Field
                      as="textarea"
                      rows="3"
                      name="description"
                      placeholder="Describe the purpose or topic of this deck..."
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition resize-none"
                    />
                    <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>

                {/* Group Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Group Cover Image
                  </label>
                  <input
                    type="file"
                    ref={groupImageInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, (base64) => setGroupImage(base64))}
                  />
                  {groupImage ? (
                    <div className="relative group w-full h-32 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                      <img src={groupImage} alt="Group Cover" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setGroupImage(null)}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs font-semibold"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => groupImageInputRef.current?.click()}
                      className="w-full h-32 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:border-red-500 hover:text-red-500 transition gap-2"
                    >
                      <FiUpload className="w-6 h-6" />
                      <span className="text-xs font-medium">Upload Image</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Card: Dynamic Terms Array */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-base font-bold text-gray-800 dark:text-white mb-4">
                Flashcard Terms & Definitions
              </h2>

              <FieldArray name="terms">
                {({ push, remove }) => (
                  <div className="space-y-4">
                    {values.terms.map((term, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 grid grid-cols-1 md:grid-cols-12 gap-4 items-start"
                      >
                        <div className="md:col-span-1 flex items-center justify-center md:pt-3">
                          <span className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-center">
                            {index + 1}
                          </span>
                        </div>

                        <div className="md:col-span-4">
                          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                            Enter Term*
                          </label>
                          <Field
                            name={`terms.${index}.termName`}
                            placeholder="e.g., Closure"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                          />
                          <ErrorMessage
                            name={`terms.${index}.termName`}
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>

                        <div className="md:col-span-5">
                          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                            Enter Definition*
                          </label>
                          <Field
                            as="textarea"
                            rows="2"
                            name={`terms.${index}.definition`}
                            placeholder="Explain the term in detail..."
                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none resize-none"
                          />
                          <ErrorMessage
                            name={`terms.${index}.definition`}
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>

                        {/* Term Image Upload & Row Actions */}
                        <div className="md:col-span-2 flex items-center gap-2 md:pt-6 justify-end">
                          <label className="cursor-pointer p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition" title="Attach image">
                            <FiImage className="w-4 h-4" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageUpload(e, (base64) =>
                                  setFieldValue(`terms.${index}.termImage`, base64)
                                )
                              }
                            />
                          </label>

                          {term.termImage && (
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                              Added
                            </span>
                          )}

                          {values.terms.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="p-2 text-gray-400 hover:text-red-500 transition"
                              title="Delete term"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => push({ termName: '', definition: '', termImage: null })}
                      className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:underline"
                    >
                      <FiPlus /> Add more terms
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Form Submit Action */}
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className="px-8 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 shadow-sm transition flex items-center gap-2 text-sm"
              >
                {isEditMode ? (
                  <>
                    <FiEdit2 /> Update Flashcard Group
                  </>
                ) : (
                  'Create Flashcard Group'
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateFlashcard;
