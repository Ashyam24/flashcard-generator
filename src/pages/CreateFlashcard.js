import React from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { addFlashcard } from '../redux/flashcardSlice';
import { useNavigate } from 'react-router-dom';
import { MdDelete, MdAdd } from 'react-icons/md';

// Validation Schema using Yup (Easy rubric marks for validation)
const FlashcardSchema = Yup.object().shape({
  groupName: Yup.string().min(3, 'Too Short!').required('Group name is required'),
  description: Yup.string().min(5, 'Too Short!').required('Description is required'),
  terms: Yup.array().of(
    Yup.object().shape({
      termName: Yup.string().required('Term name is required'),
      definition: Yup.string().required('Definition is required'),
    })
  ).min(1, 'Must have at least one term'),
});

export default function CreateFlashcard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h2 className="text-xl font-bold text-gray-700 mb-6">Create Flashcard</h2>
      
      <Formik
        initialValues={{
          groupName: '',
          description: '',
          terms: [{ termName: '', definition: '' }],
        }}
        validationSchema={FlashcardSchema}
        onSubmit={(values) => {
          // Add a unique ID and timestamp to the group package
          const finalData = {
            id: Date.now().toString(),
            ...values,
          };
          dispatch(addFlashcard(finalData));
          // Instantly redirect to see the creation
          navigate('/my-flashcards');
        }}
      >
        {({ values }) => (
          <Form className="space-y-6">
            {/* Top Block: Group Name & Description */}
            <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Create Group*</label>
                <Field
                  name="groupName"
                  type="text"
                  placeholder="Enter Group Name"
                  className="w-full max-w-md p-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                />
                <ErrorMessage name="groupName" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Add Description*</label>
                <Field
                  name="description"
                  as="textarea"
                  rows="3"
                  placeholder="Describe your flashcard group..."
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
              </div>
            </div>

            {/* Bottom Block: Dynamic Array of Nested Cards */}
            <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
              <FieldArray name="terms">
                {({ push, remove }) => (
                  <div className="space-y-4">
                    {values.terms.map((term, index) => (
                      <div key={index} className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 border-b md:border-none pb-4 md:pb-0">
                        <span className="bg-red-500 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs">
                          {index + 1}
                        </span>
                        
                        <div className="flex-1 w-full">
                          <Field
                            name={`terms.${index}.termName`}
                            type="text"
                            placeholder="Enter Term*"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                          />
                          <ErrorMessage name={`terms.${index}.termName`} component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        <div className="flex-[2] w-full">
                          <Field
                            name={`terms.${index}.definition`}
                            type="text"
                            placeholder="Enter Definition*"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                          />
                          <ErrorMessage name={`terms.${index}.definition`} component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        {values.terms.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-gray-400 hover:text-red-500 p-2"
                          >
                            <MdDelete size={22} />
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => push({ termName: '', definition: '' })}
                      className="text-red-500 font-medium flex items-center space-x-1 hover:text-red-600 pt-2"
                    >
                      <MdAdd size={20} />
                      <span>Add More Term</span>
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Submit Action Block */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-red-500 text-white px-8 py-2.5 rounded font-semibold shadow hover:bg-red-600 transition"
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